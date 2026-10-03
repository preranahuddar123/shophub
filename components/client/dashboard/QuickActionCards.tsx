'use client';

import React from 'react';
import Link from 'next/link';
import { useClientDashboard } from '@/lib/client/ClientDashboardContext';
import {
  OfferingsIcon,
  SparkleIcon,
  WalletCardIcon,
  GiftBoxIcon,
  ArrowRightIcon,
} from '../icons/ClientIcons';

export default function QuickActionCards() {
  const { data } = useClientDashboard();
  const paymentCard = data.actionCards.find((c) => c.id === 'card-payment');
  const catalogCard = data.actionCards.find((c) => c.id === 'card-catalog');
  const inspirationCard = data.actionCards.find((c) => c.id === 'card-inspiration');
  const referralCard = data.actionCards.find((c) => c.id === 'card-referral');

  return (
    <>
      {/* Column 2: Explore Latest Products (Black) & Design Inspirations (White) */}
      <div className="flex flex-col gap-5">
        {/* Explore Latest Products Card */}
        <div className="bg-[#0B0B0B] text-white rounded-[28px] p-6 sm:p-7 flex flex-col justify-between min-h-[220px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_36px_rgb(0,0,0,0.2)] transition-all group">
          <div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white">
              <OfferingsIcon className="w-6 h-6 stroke-[1.8]" />
            </div>
            <h3 className="text-xl sm:text-[22px] font-extrabold text-white tracking-tight mt-3">
              {catalogCard?.title || 'Explore Latest Products'}
            </h3>
            <p className="text-xs text-gray-300 font-normal leading-relaxed mt-2 pr-2">
              {catalogCard?.description || 'Browse our newest collections and add premium finishes to your project quote.'}
            </p>
          </div>

          <Link
            href={catalogCard?.href || '/offerings'}
            className="inline-flex items-center gap-2 text-xs font-bold text-white tracking-[0.14em] uppercase mt-5 hover:text-gray-200 transition-colors"
          >
            <span>{catalogCard?.buttonText || 'EXPLORE CATALOG'}</span>
            <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Design Inspirations Card */}
        <div className="bg-white rounded-[28px] p-6 sm:p-7 border border-black/[0.03] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[190px] hover:shadow-[0_6px_24px_-4px_rgba(0,0,0,0.06)] transition-all group">
          <div>
            <div className="w-10 h-10 flex items-center justify-center text-[#DC2626]">
              <SparkleIcon className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-[22px] font-extrabold text-gray-950 tracking-tight mt-2">
              {inspirationCard?.title || 'Design Inspirations'}
            </h3>
            <p className="text-xs text-gray-500 font-normal mt-1.5">
              {inspirationCard?.description || 'Curated boards for your vision.'}
            </p>
          </div>

          <Link
            href={inspirationCard?.href || '/client/design-inspirations'}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#DC2626] tracking-[0.14em] uppercase mt-5 hover:text-red-700 transition-colors"
          >
            <span>{inspirationCard?.buttonText || 'GET INSPIRED'}</span>
            <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Column 3: Pay Installment (White) & Refer & Earn (Red) */}
      <div className="flex flex-col gap-5">
        {/* Pay Installment Card */}
        <div className="bg-white rounded-[28px] p-6 sm:p-7 border border-black/[0.03] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[220px] hover:shadow-[0_6px_24px_-4px_rgba(0,0,0,0.06)] transition-all group">
          <div>
            <div className="w-10 h-10 flex items-center justify-center text-[#DC2626]">
              <WalletCardIcon className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-[22px] font-extrabold text-gray-950 tracking-tight mt-3">
              {paymentCard?.title || 'Pay Installment'}
            </h3>
            <p className="text-xs text-gray-500 font-normal leading-relaxed mt-2 pr-2">
              {paymentCard?.description || 'Review and pay your next project milestone payment securely.'}
            </p>
          </div>

          {paymentCard?.href?.startsWith('http') ? (
            <a
              href={paymentCard.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#DC2626] tracking-[0.14em] uppercase mt-5 hover:text-red-700 transition-colors"
            >
              <span>{paymentCard.buttonText || 'PAY NOW'}</span>
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          ) : (
            <Link
              href={paymentCard?.href || '/client/payments'}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#DC2626] tracking-[0.14em] uppercase mt-5 hover:text-red-700 transition-colors"
            >
              <span>{paymentCard?.buttonText || 'PAY NOW'}</span>
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>

        {/* Refer & Earn Card */}
        <div className="bg-[#BD1515] text-white rounded-[28px] p-6 sm:p-7 flex flex-col justify-between min-h-[190px] shadow-[0_8px_30px_rgba(189,21,21,0.2)] hover:shadow-[0_12px_36px_rgba(189,21,21,0.3)] transition-all group">
          <div>
            <div className="w-10 h-10 flex items-center justify-center text-white">
              <GiftBoxIcon className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-[22px] font-extrabold text-white tracking-tight mt-2">
              {referralCard?.title || 'Refer & Earn'}
            </h3>
            <p className="text-xs text-red-100 font-normal leading-relaxed mt-1.5 pr-2">
              {referralCard?.description || 'Earn $1,000 for every friend who starts a project with HUB.'}
            </p>
          </div>

          <Link
            href={referralCard?.href || '/client/referrals'}
            className="inline-flex items-center gap-2 text-xs font-bold text-white tracking-[0.14em] uppercase mt-5 hover:text-red-100 transition-colors"
          >
            <span>{referralCard?.buttonText || 'VIEW EARNINGS'}</span>
            <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </>
  );
}
