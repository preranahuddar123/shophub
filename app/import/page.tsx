'use client';

import { useRef, useState } from 'react';
import EnterpriseShell from '@/components/layout/EnterpriseShell';
import { PRODUCT_IMPORT_TEMPLATE_HEADERS } from '@/lib/api/product-import-map';

type ImportResult = {
  created: number;
  failed: number;
  message: string;
  errors?: { row: number; sku_id?: string; error: string }[];
};

export default function ImportPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const acceptFile = (next?: File) => {
    if (!next) return;
    const name = next.name.toLowerCase();
    if (!name.endsWith('.xlsx') && !name.endsWith('.xls') && !name.endsWith('.csv')) {
      setError('Upload an Excel (.xlsx) or CSV file.');
      return;
    }
    setFile(next);
    setError(null);
    setResult(null);
  };

  const downloadTemplate = () => {
    const csv = `${PRODUCT_IMPORT_TEMPLATE_HEADERS.join(',')}\nWalk-in Wardrobe,SKU-WW-001,PRODUCT,FURNITURE,Hub Homes Royale,5,"wardrobe,luxury",Custom walk-in closet,Bespoke Italian wardrobe,125000,80000,0,GST_18,PER_PIECE,12,4,8,IN_HOUSE,14,https://example.com/wardrobe.jpg,200,180,240,180,SOLID_WOOD,MATTE,Walk-in Wardrobes,Bespoke Italian wardrobes,walk-in-wardrobes,"wardrobe,closet",true,false\n`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'product-import-template.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    if (!file) {
      setError('Choose an Excel file first.');
      return;
    }
    setIsUploading(true);
    setError(null);
    setResult(null);
    try {
      const body = new FormData();
      body.append('file', file);
      const res = await fetch('/api/products/import', { method: 'POST', body, credentials: 'include' });
      const data = await res.json();
      if (!res.ok && !data?.message) {
        throw new Error(data?.error || 'Import failed');
      }
      setResult(data);
      if (data.created === 0 && data.error) setError(data.error);
    } catch (err: any) {
      setError(err.message || 'Import failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <EnterpriseShell title="Import" placeholder="Search catalog...">
      <main className="ml-56 pt-16 p-8 max-w-3xl">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Import products</h1>
        <p className="mt-1 text-sm text-gray-500">
          Upload an Excel sheet. Each row is mapped to{' '}
          <span className="font-medium text-gray-700">POST /api/v1/products/createProduct</span>.
        </p>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={downloadTemplate}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-50"
          >
            Download template
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
          className="hidden"
          onChange={(e) => acceptFile(e.target.files?.[0])}
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            acceptFile(e.dataTransfer.files?.[0]);
          }}
          className="mt-6 w-full rounded-2xl border-2 border-dashed border-gray-200 bg-white px-6 py-12 text-center hover:border-gray-400"
        >
          <p className="text-sm font-semibold text-gray-900">
            {file ? file.name : 'Drop Excel here or click to upload'}
          </p>
          <p className="mt-1 text-xs text-gray-400">.xlsx, .xls, or .csv · first sheet · max 250 rows</p>
        </button>

        <button
          type="button"
          disabled={!file || isUploading}
          onClick={handleImport}
          className="mt-4 rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
        >
          {isUploading ? 'Importing…' : 'Import products'}
        </button>

        {error && (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}

        {result && (
          <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-sm font-semibold text-gray-900">{result.message}</p>
            <p className="mt-1 text-xs text-gray-500">
              Created {result.created} · Failed {result.failed}
            </p>
            {result.errors && result.errors.length > 0 && (
              <ul className="mt-3 space-y-1 text-xs text-red-600">
                {result.errors.slice(0, 12).map((item) => (
                  <li key={`${item.row}-${item.sku_id || item.error}`}>
                    Row {item.row}
                    {item.sku_id ? ` (${item.sku_id})` : ''}: {item.error}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-bold text-gray-900">Column mapping</h2>
          <p className="mt-1 text-xs text-gray-500">
            Header names are matched case-insensitively. Required: offering_name (or name) and sku_id (or sku).
          </p>
          <dl className="mt-4 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-gray-700">Identity</dt>
              <dd className="text-gray-500">offering_name, sku_id, offering_type, category, brand, brand_id, tags</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-700">Pricing</dt>
              <dd className="text-gray-500">selling_price, cost_price, discount, gst_rate, units</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-700">Inventory</dt>
              <dd className="text-gray-500">current_stock, minimum_stock_level, reorder_quantity, preferred_vendor, lead_time</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-700">Media / specs / SEO</dt>
              <dd className="text-gray-500">primary_image, length, width, height, weight, page_title, meta_desc, keywords, is_published</dd>
            </div>
          </dl>
        </div>
      </main>
    </EnterpriseShell>
  );
}
