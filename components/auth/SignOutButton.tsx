'use client';

import { useRouter } from 'next/navigation';

export default function SignOutButton({ className = '' }: { className?: string }) {
  const router = useRouter();

  async function signOut() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login');
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={signOut}
      className={className || 'text-xs font-semibold text-gray-600 hover:text-gray-950'}
    >
      Sign out
    </button>
  );
}
