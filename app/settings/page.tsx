'use client';

import EnterpriseShell from '@/components/layout/EnterpriseShell';
import SignOutButton from '@/components/auth/SignOutButton';
import { firstNameFrom, roleLabel, useCurrentUser } from '@/lib/auth/useCurrentUser';

export default function SettingsPage() {
  const user = useCurrentUser();

  return (
    <EnterpriseShell title="Settings" placeholder="Search settings...">
      <main className="ml-56 pt-16 p-8 max-w-3xl">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Workspace account details for this login.</p>

        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Name</p>
            <p className="text-sm font-medium text-gray-900">{user?.name || firstNameFrom(user)}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Email</p>
            <p className="text-sm font-medium text-gray-900">{user?.email || '—'}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Role</p>
            <p className="text-sm font-medium text-gray-900">{roleLabel(user) || '—'}</p>
          </div>
          <SignOutButton className="inline-flex rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-50" />
        </section>
      </main>
    </EnterpriseShell>
  );
}
