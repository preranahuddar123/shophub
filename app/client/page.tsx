import React from 'react';
import type { Metadata } from 'next';
import ClientDashboard from '@/components/client/dashboard/ClientDashboard';

export const metadata: Metadata = {
  title: 'Client Portal - HUB',
  description: 'Track your interior project journey, quotes, milestones, and payments with HUB Client Portal.',
};

export default function ClientPage() {
  return <ClientDashboard />;
}
