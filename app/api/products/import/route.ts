import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { getSessionFromRequest } from '@/lib/auth/account';
import { excelRowToProduct } from '@/lib/api/product-import-map';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session || (session.role !== 'admin' && session.role !== 'enterprise')) {
    return NextResponse.json({ success: false, error: 'Sign in required.' }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ success: false, error: 'Upload an Excel or CSV file.' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet) {
    return NextResponse.json({ success: false, error: 'The spreadsheet has no sheets.' }, { status: 400 });
  }

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });
  if (!rows.length) {
    return NextResponse.json({ success: false, error: 'No rows found in the file.' }, { status: 400 });
  }

  const origin = new URL(request.url).origin;
  const cookie = request.headers.get('cookie') || '';
  const created: { sku_id: string; offering_name: string }[] = [];
  const failed: { row: number; sku_id?: string; error: string }[] = [];

  for (let i = 0; i < rows.length && i < 250; i++) {
    const payload = excelRowToProduct(rows[i]);
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
