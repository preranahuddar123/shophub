'use client';

import Sidebar from '@/components/layout/Sidebar';
import TopHeader from '@/components/layout/TopHeader';

export default function EnterpriseShell({
  children,
  title,
  searchQuery,
  onSearchChange,
  placeholder,
  extraActions,
}: {
  children: React.ReactNode;
  title?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  placeholder?: string;
  extraActions?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <TopHeader
        title={title}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        placeholder={placeholder}
        extraActions={extraActions}
      />
      {children}
    </div>
  );
}
