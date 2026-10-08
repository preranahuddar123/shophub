'use client';

import Sidebar from '@/components/layout/Sidebar';
import TopHeader from '@/components/layout/TopHeader';
import CreateOfferingForm from './CreateOfferingForm';

export default function CreateOfferings() {
  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <TopHeader title="ERP Offerings" />
      <main className="ml-56 pt-16 min-h-screen bg-white">
        <CreateOfferingForm />
      </main>
    </div>
  );
}
