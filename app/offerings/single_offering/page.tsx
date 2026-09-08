'use client';

import StoreProvider from '@/components/providers/StoreProvider';
import Sidebar from '@/components/layout/Sidebar';
import TopHeader from '@/components/layout/TopHeader';
import OfferingDetailView from '@/components/offerings/detail/OfferingDetailView';

function SingleOfferingContent() {
  return (
    <div className="min-h-screen bg-gray-50/60">
      <Sidebar />
      <TopHeader
        searchQuery=""
        onSearchChange={() => {}}
      />

      <main className="ml-56 pt-20 px-6 sm:px-8">
        <OfferingDetailView />
      </main>
    </div>
  );
}

export default function SingleOfferingPage() {
  return (
    <StoreProvider>
      <SingleOfferingContent />
    </StoreProvider>
  );
}
