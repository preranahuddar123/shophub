import type { Metadata } from 'next';
import ClientDashboard from '@/components/client/dashboard/ClientDashboard';

export const metadata: Metadata = {
  title: 'HUB - Client Portal',
  description: 'Track your interior project journey, quotes, milestones, and payments.',
};

export default function Home() {
  return <ClientDashboard />;
}
