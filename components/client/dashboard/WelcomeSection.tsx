'use client';

import React from 'react';
import { useClientDashboard } from '@/lib/client/ClientDashboardContext';

export default function WelcomeSection() {
  const { data } = useClientDashboard();
  const firstName = data.profile.name.split(' ')[0] || data.profile.name;

  return (
    <div className="mb-8">
      <h1 className="text-4xl sm:text-[42px] font-extrabold text-gray-950 tracking-tight leading-tight">
        Hello, {firstName}
      </h1>
      <p className="text-gray-600 text-[16.5px] mt-2 font-normal">
        {data.profile.projectGreeting}
      </p>
    </div>
  );
}
