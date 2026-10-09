'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import EnterpriseShell from '@/components/layout/EnterpriseShell';

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <EnterpriseShell title="Dashboard" searchQuery={searchQuery} onSearchChange={setSearchQuery} placeholder="Search Offerings...">
      <main className="ml-56 pt-16 p-8 max-w-[1400px]">
          {/* ------------------------------------------------------------------- */}
          {/* HEADER: Title, Subtitle & Action Buttons                            */}
          {/* ------------------------------------------------------------------- */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Offerings Dashboard
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Manage and monitor your enterprise catalog health and performance.
              </p>
            </div>

            {/* Action Buttons: Add Brand & Create Price List */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
              {/* Add Brand */}
              <button className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-2xs transition-colors">
                <span className="font-mono text-[11px] font-bold tracking-tighter bg-gray-100 px-1 py-0.5 rounded border border-gray-200">
                  Aa
                </span>
                <span>Add Brand</span>
              </button>

              {/* Create Price List */}
              <button className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-2xs transition-colors">
                <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="2" y="5" width="20" height="14" rx="2" strokeWidth={1.8} />
                  <line x1="2" y1="10" x2="22" y2="10" strokeWidth={1.8} />
                </svg>
                <span>Create Price List</span>
              </button>
            </div>
          </div>

          {/* ------------------------------------------------------------------- */}
          {/* ROW 1: 4 TOP METRIC CARDS                                           */}
          {/* ------------------------------------------------------------------- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Card 1: TOTAL OFFERINGS */}
            <div className="bg-white rounded-xl border border-gray-200/90 p-5 shadow-2xs">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Total Offerings
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-gray-900 tracking-tight">2,842</span>
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  +12%
                </span>
              </div>
            </div>

            {/* Card 2: ACTIVE ITEMS */}
            <div className="bg-white rounded-xl border border-gray-200/90 p-5 shadow-2xs">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Active Items
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-gray-900 tracking-tight">2,105</span>
                <span className="text-xs text-gray-400 font-medium">74% total</span>
              </div>
            </div>

            {/* Card 3: DRAFTS */}
            <div className="bg-white rounded-xl border border-gray-200/90 p-5 shadow-2xs">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Drafts
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-gray-900 tracking-tight">418</span>
                <span className="text-xs text-amber-500 font-medium">Needs review</span>
              </div>
            </div>

            {/* Card 4: ARCHIVED */}
            <div className="bg-white rounded-xl border border-gray-200/90 p-5 shadow-2xs">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Archived
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-gray-900 tracking-tight">319</span>
                <span className="text-xs text-gray-400 font-medium">Legacy</span>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------------- */}
          {/* ROW 2: CATALOG HEALTH & ALERTS | CATALOG COMPOSITION                */}
          {/* ------------------------------------------------------------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            {/* Left Card (col-span-7): Catalog Health & Missing Data Alerts */}
            <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200/90 p-6 shadow-2xs">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Sub-column 1: Catalog Health & Gauge */}
                <div className="md:col-span-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="font-bold text-sm text-gray-900">Catalog Health</span>
                      <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>

                    {/* Donut Progress Gauge */}
                    <div className="flex flex-col items-center justify-center my-3">
                      <div className="relative w-28 h-28 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          {/* Background Track */}
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="#F3F4F6"
                            strokeWidth="9"
                            fill="transparent"
                          />
                          {/* Active Progress: 88% */}
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="#000000"
                            strokeWidth="9"
                            strokeDasharray={251.3}
                            strokeDashoffset={251.3 * (1 - 0.88)}
                            strokeLinecap="round"
                            fill="transparent"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                          <span className="text-xl font-extrabold text-gray-900 leading-tight">88%</span>
                          <span className="text-[9px] font-bold text-gray-400 tracking-wider uppercase">
                            Ready
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center text-xs text-gray-400 font-medium">
                    4 SKU warnings detected
                  </div>
                </div>

                {/* Sub-column 2: Missing Data Alerts */}
                <div className="md:col-span-7 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                  <div className="font-bold text-sm text-gray-900 mb-3">
                    Missing Data Alerts
                  </div>

                  <div className="space-y-2.5">
                    {/* Alert 1 */}
                    <div className="bg-[#FAFBFD] border border-gray-100 rounded-lg p-2.5 flex items-start gap-3">
                      <div className="w-7 h-7 rounded bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2zM3 3l18 18"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900">Missing Product Images</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">112 offerings require primary visuals</div>
                      </div>
                    </div>

                    {/* Alert 2 */}
                    <div className="bg-[#FAFBFD] border border-gray-100 rounded-lg p-2.5 flex items-start gap-3">
                      <div className="w-7 h-7 rounded bg-amber-50 text-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900">Undefined Pricing</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">45 items have no active price list</div>
                      </div>
                    </div>

                    {/* Alert 3 */}
                    <div className="bg-[#FAFBFD] border border-gray-100 rounded-lg p-2.5 flex items-start gap-3">
                      <div className="w-7 h-7 rounded bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900">Missing Specifications</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">28 service packages lack T&Cs</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card (col-span-5): Catalog Composition */}
            <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200/90 p-6 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="font-bold text-sm text-gray-900 mb-5">
                  Catalog Composition
                </div>

                <div className="space-y-4">
                  {/* Products */}
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="font-medium text-gray-600">Products</span>
                      <span className="font-bold text-gray-900">1,840</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-black rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>

                  {/* Services */}
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="font-medium text-gray-600">Services</span>
                      <span className="font-bold text-gray-900">620</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-neutral-600 rounded-full" style={{ width: '22%' }}></div>
                    </div>
                  </div>

                  {/* Packages */}
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="font-medium text-gray-600">Packages</span>
                      <span className="font-bold text-gray-900">382</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gray-300 rounded-full" style={{ width: '13%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Composition Note Footer */}
              <div className="border-t border-gray-100 pt-4 mt-6">
                <div className="flex items-center gap-1.5 text-xs text-blue-600 italic">
                  <svg className="w-3.5 h-3.5 not-italic flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth={1.8} />
                    <line x1="12" y1="16" x2="12" y2="12" strokeWidth={1.8} />
                    <circle cx="12" cy="8" r="0.5" fill="currentColor" />
                  </svg>
                  <span>Packages represent 32% of total revenue.</span>
                </div>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------------- */}
          {/* ROW 3: QUOTE METRICS (3 CARDS)                                      */}
          {/* ------------------------------------------------------------------- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Card 1: QUOTES CREATED (MTD) */}
            <div className="bg-white rounded-xl border border-gray-200/90 p-5 shadow-2xs">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Quotes Created (MTD)
              </div>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-extrabold text-gray-900 tracking-tight leading-none">
                  842
                </span>
                {/* 5-bar vertical histogram */}
                <div className="flex items-end gap-1.5 h-7">
                  <div className="w-2.5 h-2 bg-gray-200 rounded-xs"></div>
                  <div className="w-2.5 h-3 bg-gray-200 rounded-xs"></div>
                  <div className="w-2.5 h-6 bg-black rounded-xs"></div>
                  <div className="w-2.5 h-4 bg-black rounded-xs"></div>
                  <div className="w-2.5 h-7 bg-black rounded-xs"></div>
                </div>
              </div>
            </div>

            {/* Card 2: APPROVED VALUE */}
            <div className="bg-white rounded-xl border border-gray-200/90 p-5 shadow-2xs">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Approved Value
              </div>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-extrabold text-gray-900 tracking-tight leading-none">
                  $2.4M
                </span>
                {/* Green trending up arrow */}
                <svg className="w-7 h-7 text-emerald-500 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7m0 0H9m8 0v8" />
                </svg>
              </div>
            </div>

            {/* Card 3: AVG. QUOTE VALUE */}
            <div className="bg-white rounded-xl border border-gray-200/90 p-5 shadow-2xs">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Avg. Quote Value
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-gray-900 tracking-tight leading-none">
                  $2,840
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  +4.2% vs last mo
                </span>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------------- */}
          {/* ROW 4: MOST USED OFFERINGS | RECENT ACTIVITY                        */}
          {/* ------------------------------------------------------------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            {/* Left Card (col-span-7): Most Used Offerings */}
            <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200/90 p-6 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-sm text-gray-900">Most Used Offerings</span>
                <Link
                  href="/offerings"
                  className="text-xs font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
                >
                  View All &rarr;
                </Link>
              </div>

              <div className="space-y-3">
                {/* Item 1: Carrara Elite Marble Slab */}
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100 flex items-center justify-center">
                      <Image
                        src="/images/products/carrara-marble.svg"
                        alt="Carrara Elite Marble Slab"
                        width={44}
                        height={44}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900">
                        Carrara Elite Marble Slab
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        Products &gt; Surfaces &gt; Natural Stone
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-right">
                    <span className="text-xs font-bold text-gray-900">$420 / sqm</span>
                    <div className="w-20">
                      <div className="text-xs font-bold text-gray-900">142 uses</div>
                      <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                        In Stock
                      </div>
                    </div>
                  </div>
                </div>

                {/* Item 2: Premium Design Consultation */}
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100 flex items-center justify-center">
                      <Image
                        src="/images/products/design-consultation.svg"
                        alt="Premium Design Consultation"
                        width={44}
                        height={44}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900">
                        Premium Design Consultation
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        Services &gt; Consultations
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-right">
                    <span className="text-xs font-bold text-gray-900">$1,200 / package</span>
                    <div className="w-20">
                      <div className="text-xs font-bold text-gray-900">98 uses</div>
                      <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                        Available
                      </div>
                    </div>
                  </div>
                </div>

                {/* Item 3: Smart Lighting Bundle (Eco) */}
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100 flex items-center justify-center">
                      <Image
                        src="/images/products/smart-lighting.svg"
                        alt="Smart Lighting Bundle (Eco)"
                        width={44}
                        height={44}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900">
                        Smart Lighting Bundle (Eco)
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        Packages &gt; Automation
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-right">
                    <span className="text-xs font-bold text-gray-900">$3,450 / unit</span>
                    <div className="w-20">
                      <div className="text-xs font-bold text-gray-900">75 uses</div>
                      <div className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                        Low Stock
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card (col-span-5): Recent Activity */}
            <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200/90 p-6 shadow-2xs">
              <div className="font-bold text-sm text-gray-900 mb-5">
                Recent Activity
              </div>

              {/* Timeline Container */}
              <div className="relative pl-6 space-y-5 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-gray-100">
                {/* Event 1 */}
                <div className="relative">
                  <div className="absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full border-2 border-black bg-white"></div>
                  <div>
                    <p className="text-xs text-gray-700 leading-snug">
                      <span className="font-bold text-gray-900">Alex Rivera</span> updated pricing for{' '}
                      <span className="text-blue-600 font-medium cursor-pointer hover:underline">
                        Oak Flooring series
                      </span>
                    </p>
                    <span className="text-[10px] text-gray-400 font-medium block mt-1">2 minutes ago</span>
                  </div>
                </div>

                {/* Event 2 */}
                <div className="relative">
                  <div className="absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-700 leading-snug">
                      <span className="font-bold text-gray-900">System</span> automatically archived 4 legacy offerings
                    </p>
                    <span className="text-[10px] text-gray-400 font-medium block mt-1">1 hour ago</span>
                  </div>
                </div>

                {/* Event 3 */}
                <div className="relative">
                  <div className="absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full border-2 border-emerald-500 bg-white flex items-center justify-center text-[10px] font-bold text-emerald-500 leading-none">
                    +
                  </div>
                  <div>
                    <p className="text-xs text-gray-700 leading-snug">
                      <span className="font-bold text-gray-900">Jordan Smith</span> imported{' '}
                      <span className="font-bold text-gray-900">42 new Products</span> from Vendor: Arclinea
                    </p>
                    <span className="text-[10px] text-gray-400 font-medium block mt-1">3 hours ago</span>
                  </div>
                </div>

                {/* Event 4 */}
                <div className="relative">
                  <div className="absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-700 leading-snug">
                      <span className="font-bold text-gray-900">Maria Chen</span> modified spec sheet for{' '}
                      <span className="text-blue-600 font-medium cursor-pointer hover:underline">
                        HVAC Bronze Package
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </main>
    </EnterpriseShell>
  );
}
