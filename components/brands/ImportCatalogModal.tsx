'use client';

/**
 * ==============================================================================
 * COMPONENT: components/brands/ImportCatalogModal.tsx
 * PURPOSE: Modal Dialog for Bulk Importing Catalog / Brands via CSV or JSON
 * ==============================================================================
 * TRIGGERED BY:
 * - The "IMPORT" button in the Brands Master page header.
 *
 * FUNCTIONALITY:
 * - Allows users to paste raw CSV or JSON data or upload a file.
 * - Includes a "Load Sample Data" button with pre-formatted schema.
 * - Parses entries and sends batch payload to `POST /api/brands/import`.
 * - Upserts records directly into `homes_merry.brands` without duplicates.
 * ==============================================================================
 */

import React, { useState } from 'react';

interface ImportCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: () => void;
}

export default function ImportCatalogModal({

  isOpen,
  onClose,
  onImportComplete,
}: ImportCatalogModalProps) {
  const [importType, setImportType] = useState<'csv' | 'json'>('json');
  const [rawText, setRawText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Sample JSON template matching Apidog / catalog schema
  const sampleJson = `[
  {
    "brand_name": "Studio Italia Design",
    "manufacturer": "Venetian Light Group",
    "code": "SID-IT-19",
    "country": "Italy",
    "country_code": "IT",
    "offerings_count": 340,
    "categories": ["LIGHTING", "DECOR"],
    "status": "ACTIVE"
  },
  {
    "brand_name": "Carl Hansen & Søn",
    "manufacturer": "Odense Furniture Atelier",
    "code": "CHS-DK-08",
    "country": "Denmark",
    "country_code": "DK",
    "offerings_count": 520,
    "categories": ["FURNITURE"],
    "status": "ACTIVE"
  }
]`;

  const handleLoadSample = () => {
    setRawText(sampleJson);
    setError(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setRawText(content);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!rawText.trim()) {
      setError('Please provide CSV or JSON data to import.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      let itemsToImport: any[] = [];

      if (importType === 'json' || rawText.trim().startsWith('[')) {
        itemsToImport = JSON.parse(rawText);
      } else {
        // Parse simple CSV
        const lines = rawText.trim().split('\n');
        const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, '').toLowerCase());

        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          const cols = lines[i].split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
          const item: any = {};
          headers.forEach((h, idx) => {
            item[h] = cols[idx];
          });
          if (item['brand name'] || item.brand_name || item.brand) {
            item.brand_name = item['brand name'] || item.brand_name || item.brand;
            itemsToImport.push(item);
          }
        }
      }

      if (!itemsToImport.length) {
        throw new Error('No valid records parsed from input.');
      }

      const res = await fetch('/api/brands/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsToImport }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to import data');
      }

      setSuccessMsg(`Successfully imported ${data.importedCount} brands into the catalog!`);
      setTimeout(() => {
        onImportComplete();
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Error importing data');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-black text-gray-950 tracking-tight">Import Catalog Data</h2>
              <p className="text-xs text-gray-500">Bulk upload manufacturer brands & offerings into ERP Master Catalog.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold">
            {successMsg}
          </div>
        )}

        <div className="space-y-4">
          {/* Format Switcher */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setImportType('json')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  importType === 'json'
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                JSON Array
              </button>
              <button
                type="button"
                onClick={() => setImportType('csv')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  importType === 'csv'
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                CSV File
              </button>
            </div>

            <button
              type="button"
              onClick={handleLoadSample}
              className="text-xs font-bold text-[#2563EB] hover:underline cursor-pointer"
            >
              Load Sample Template
            </button>
          </div>

          {/* File Upload Box */}
          <div className="border-2 border-dashed border-gray-200 hover:border-gray-400 rounded-2xl p-4 text-center bg-[#F9FAFB] transition-colors relative cursor-pointer">
            <input
              type="file"
              accept=".json,.csv"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <svg className="w-8 h-8 text-gray-400 mx-auto mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <div className="text-xs font-bold text-gray-800">
              Drag & drop a file here, or click to browse
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5">Supports .JSON or .CSV catalog files</div>
          </div>

          {/* Raw Text Input */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              Data Preview / Direct Paste
            </label>
            <textarea
              rows={6}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste JSON or CSV data here..."
              className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-5 mt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={isSubmitting || !rawText.trim()}
            className="px-5 py-2 bg-black hover:bg-gray-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? 'Importing...' : 'Import Catalog Data'}
          </button>
        </div>
      </div>
    </div>
  );
}
