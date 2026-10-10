import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth/account';
import { excelRowToProduct, parseColumnMapping } from '@/lib/api/product-import-map';
import { fetchGoogleSheetTable, parseSpreadsheetBuffer } from '@/lib/api/spreadsheet-source';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session || (session.role !== 'admin' && session.role !== 'enterprise')) {
    return NextResponse.json({ success: false, error: 'Sign in required.' }, { status: 401 });
  }

  const form = await request.formData();
  const sheetUrl = String(form.get('sheetUrl') || '').trim();
  const file = form.get('file');

  let mapping;
  try {
    mapping = parseColumnMapping(form.get('mapping'));
  } catch {
    return NextResponse.json({ success: false, error: 'Column mapping is invalid.' }, { status: 400 });
  }

  if (mapping && (!mapping.offering_name || !mapping.sku_id)) {
    return NextResponse.json(
      { success: false, error: 'Map sheet columns to Offering name and SKU ID before importing.' },
      { status: 400 }
    );
  }

  let rows: Record<string, unknown>[] = [];
  try {
    if (sheetUrl) {
      rows = (await fetchGoogleSheetTable(sheetUrl)).rows;
    } else if (file instanceof File) {
      rows = parseSpreadsheetBuffer(Buffer.from(await file.arrayBuffer())).rows;
    } else {
      return NextResponse.json(
        { success: false, error: 'Upload an Excel/CSV file or paste a Google Sheets link.' },
        { status: 400 }
      );
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Could not read the spreadsheet.' }, { status: 400 });
  }

  if (!rows.length) {
    return NextResponse.json({ success: false, error: 'No rows found in the file.' }, { status: 400 });
  }

  const origin = new URL(request.url).origin;
  const cookie = request.headers.get('cookie') || '';
  const created: { sku_id: string; offering_name: string }[] = [];
  const failed: { row: number; sku_id?: string; error: string }[] = [];

  for (let i = 0; i < rows.length && i < 250; i++) {
    const payload = excelRowToProduct(rows[i], mapping);
    if (!payload) {
      failed.push({ row: i + 2, error: 'offering_name and sku_id are required.' });
      continue;
    }
    try {
      const res = await fetch(`${origin}/api/offerings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          cookie,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.success === false) {
        failed.push({
          row: i + 2,
          sku_id: payload.sku_id,
          error: data?.error || data?.message || `Request failed (${res.status})`,
        });
        continue;
      }
      created.push({ sku_id: payload.sku_id, offering_name: payload.offering_name });
    } catch (err: any) {
      failed.push({ row: i + 2, sku_id: payload.sku_id, error: err.message || 'Create failed' });
    }
  }

  return NextResponse.json({
    success: failed.length === 0,
    created: created.length,
    failed: failed.length,
    items: created,
    errors: failed,
    message: `Imported ${created.length} product${created.length === 1 ? '' : 's'} via createProduct.${failed.length ? ` ${failed.length} row(s) failed.` : ''}`,
  });
}
