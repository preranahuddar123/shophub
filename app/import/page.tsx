'use client';

import { useState } from 'react';
import EnterpriseShell from '@/components/layout/EnterpriseShell';
import ImportCatalogModal from '@/components/brands/ImportCatalogModal';

export default function ImportPage() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <EnterpriseShell title="Import" placeholder="Search catalog...">
      <main className="ml-56 pt-16 p-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Import catalog</h1>
        <p className="mt-1 text-sm text-gray-500">
          Upload CSV or JSON to add brands into the master catalog.
        </p>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="mt-6 rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white"
        >
          Open importer
        </button>
        <ImportCatalogModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onImportComplete={() => setIsOpen(false)}
        />
      </main>
    </EnterpriseShell>
  );
}
