import * as XLSX from 'xlsx';

export type SpreadsheetTable = {
  headers: string[];
  rows: Record<string, unknown>[];
};

function looksLikeHtml(text: string) {
  const start = text.slice(0, 300).toLowerCase();
  return start.includes('<!doctype') || start.includes('<html') || text.includes('accounts.google.com');
}

export function parseSpreadsheetBuffer(buffer: Buffer): SpreadsheetTable {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet) throw new Error('The spreadsheet has no sheets.');
  const matrix = XLSX.utils.sheet_to_json<(string | number)[]>(sheet, { header: 1, defval: '' });
  const headers = (matrix[0] || []).map((cell) => String(cell).trim()).filter(Boolean);
  if (!headers.length) throw new Error('The first row must contain column headers.');
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '', raw: false });
  if (!rows.length) throw new Error('No data rows found in the spreadsheet.');
  return { headers, rows };
}

export function isGoogleSheetUrl(input: string) {
  try {
    const url = new URL(input.trim());
    return url.protocol === 'https:' && (url.hostname === 'docs.google.com' || url.hostname === 'spreadsheets.google.com');
  } catch {
    return false;
  }
}

function gidFromUrl(url: URL) {
  return url.searchParams.get('gid') || url.hash.match(/gid=(\d+)/)?.[1] || '0';
}

export function googleSheetExportUrl(input: string) {
  if (!isGoogleSheetUrl(input)) {
    throw new Error('Paste a Google Sheets link.');
  }

  const url = new URL(input.trim());
  const alreadyCsv =
    url.pathname.includes('/export') ||
    url.searchParams.get('output') === 'csv' ||
    url.searchParams.get('format') === 'csv' ||
    (url.searchParams.get('tqx') || '').includes('csv');
  if (alreadyCsv) return url.toString();

  const published = url.pathname.match(/\/spreadsheets\/d\/e\/([^/]+)/);
  if (published) {
    return `https://docs.google.com/spreadsheets/d/e/${published[1]}/pub?output=csv&gid=${gidFromUrl(url)}`;
  }

  const id = url.pathname.match(/\/spreadsheets\/d\/([^/]+)/)?.[1];
  if (!id) throw new Error('Could not read the spreadsheet ID from that link.');
  return `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=${gidFromUrl(url)}`;
}

export async function fetchGoogleSheetTable(input: string): Promise<SpreadsheetTable> {
  const csvUrl = googleSheetExportUrl(input);
  const res = await fetch(csvUrl, {
    redirect: 'follow',
    headers: { Accept: 'text/csv,text/plain,*/*' },
  });
  const buffer = Buffer.from(await res.arrayBuffer());
  const text = buffer.toString('utf8');
  if (!res.ok || looksLikeHtml(text)) {
    throw new Error(
      'Could not read that Google Sheet. Share it as Anyone with the link → Viewer, then try again.'
    );
  }
  return parseSpreadsheetBuffer(buffer);
}
