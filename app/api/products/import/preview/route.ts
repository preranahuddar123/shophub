import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth/account';
import { fetchGoogleSheetTable } from '@/lib/api/spreadsheet-source';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session || (session.role !== 'admin' && session.role !== 'enterprise')) {
    return NextResponse.json({ success: false, error: 'Sign in required.' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const sheetUrl = String(body.sheetUrl || '').trim();
  if (!sheetUrl) {
    return NextResponse.json({ success: false, error: 'Paste a Google Sheets link.' }, { status: 400 });
  }

  try {
    const table = await fetchGoogleSheetTable(sheetUrl);
    return NextResponse.json({
      success: true,
      headers: table.headers,
      previewRows: table.rows.slice(0, 3),
      rowCount: table.rows.length,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Could not load Google Sheet.' }, { status: 400 });
  }
}
