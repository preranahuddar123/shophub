'use client';

import { Suspense } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopHeader from '@/components/layout/TopHeader';
import CreateOfferingForm from './CreateOfferingForm';

export default function CreateOfferings() {
  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <TopHeader title="ERP Offerings" />
      <main className="ml-56 pt-16 min-h-screen bg-white">
        <Suspense fallback={<div className="p-10 text-sm text-gray-500">Loading offering form...</div>}>
          <CreateOfferingForm />
        </Suspense>
      </main>
    </div>
  );
}
