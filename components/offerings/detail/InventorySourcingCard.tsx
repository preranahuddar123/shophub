'use client';

import { useState } from 'react';

interface WarehouseRow {
  warehouse: string;
  onHand: number;
  allocated: number;
  reorderPoint: number;
  status: 'Optimal' | 'Low Stock' | 'Critical';
}

interface InventorySourcingCardProps {
  preferredVendor?: string;
  lastUpdate?: string;
}

export default function InventorySourcingCard({
  preferredVendor = 'Nordic Design Collective (NDC)',
  lastUpdate = 'Last price update: 14 days ago',
}: InventorySourcingCardProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheckMessage, setLastCheckMessage] = useState<string | null>(null);

  const warehouses: WarehouseRow[] = [
    {
      warehouse: 'Main Distribution Center (EU)',
      onHand: 42,
      allocated: 12,
      reorderPoint: 15,
      status: 'Optimal',
    },
    {
      warehouse: 'Regional Hub (North America)',
      onHand: 8,
      allocated: 6,
      reorderPoint: 10,
      status: 'Low Stock',
    },
  ];

  const handleCheckLive = () => {
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      setLastCheckMessage('Inventory synced live just now');
      setTimeout(() => setLastCheckMessage(null), 3000);
    }, 600);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-gray-900 tracking-tight">
            Inventory & Sourcing
          </h2>
          {lastCheckMessage && (
            <span className="text-[11px] font-semibold text-green-600 animate-fade-in bg-green-50 px-2 py-0.5 rounded">
              {lastCheckMessage}
            </span>
          )}
        </div>
        <button
          onClick={handleCheckLive}
          disabled={isChecking}
          className="bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 px-4 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 flex items-center gap-1.5 shadow-xs"
        >
          {isChecking && (
            <svg className="animate-spin -ml-0.5 h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          )}
          <span>{isChecking ? 'Checking...' : 'Check Live'}</span>
        </button>
      </div>

      {/* Warehouses Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <th className="pb-3 pr-4 font-bold">WAREHOUSE</th>
              <th className="pb-3 px-4 font-bold">ON HAND</th>
              <th className="pb-3 px-4 font-bold">ALLOCATED</th>
              <th className="pb-3 px-4 font-bold">REORDER POINT</th>
              <th className="pb-3 pl-4 font-bold text-right">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-xs">
            {warehouses.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-3.5 pr-4 font-bold text-gray-900">
                  {row.warehouse}
                </td>
                <td className="py-3.5 px-4 font-medium text-gray-700">
                  {row.onHand} units
                </td>
                <td className="py-3.5 px-4 text-gray-600">
                  {row.allocated} units
                </td>
                <td className="py-3.5 px-4 text-gray-600">
                  {row.reorderPoint} units
                </td>
                <td className="py-3.5 pl-4 text-right">
                  <span
                    className={`font-bold ${
                      row.status === 'Optimal'
                        ? 'text-green-600'
                        : row.status === 'Low Stock'
                        ? 'text-amber-500'
                        : 'text-red-600'
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sourcing Logistics Footer */}
      <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div>
          <span className="text-gray-400 font-bold uppercase tracking-wider text-[11px]">
            PREFERRED VENDOR:
          </span>{' '}
          <span className="font-bold text-gray-900">
            {preferredVendor}
          </span>
        </div>
        <div className="text-gray-400 text-xs">
          {lastUpdate}
        </div>
      </div>
    </div>
  );
}
