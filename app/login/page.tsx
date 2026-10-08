'use client';

import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import type { PortalRole } from '@/lib/auth/session';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState<PortalRole>('enterprise');
  const [email, setEmail] = useState('enterprise@hubinterior.com');
  const [password, setPassword] = useState('Enterprise@123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function switchRole(next: PortalRole) {
    setRole(next);
    setError(null);
    if (next === 'enterprise') {
      setEmail('enterprise@hubinterior.com');
      setPassword('Enterprise@123');
    } else {
      setEmail('client@hubinterior.com');
      setPassword('Client@123');
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await response.json();
      if (!response.ok || !data?.success) {
        throw new Error(data?.error || 'Unable to sign in.');
      }
      const next = searchParams.get('next');
      const allowedNext =
        data.user.role === 'enterprise'
          ? next && !next.startsWith('/client') && next !== '/'
          : next && (next.startsWith('/client') || next === '/');
      router.replace(allowedNext && next ? next : data.redirect);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#FAF7F2]">
      <aside className="hidden lg:flex flex-col justify-between bg-black text-white p-12">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg grid place-items-center">
              <div className="grid grid-cols-2 gap-0.5">
                <span className="w-2.5 h-2.5 bg-black" />
                <span className="w-2.5 h-2.5 bg-black" />
                <span className="w-2.5 h-2.5 bg-black" />
                <span className="w-2.5 h-2.5 bg-black" />
              </div>
            </div>
            <div>
              <div className="font-bold text-lg leading-tight">Offerings Pro</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-gray-400">ShopHub</div>
            </div>
          </div>
          <h1 className="mt-16 text-4xl font-extrabold tracking-tight leading-tight">
            One login for the catalog you own
            <span className="block text-gray-400 font-semibold mt-3 text-xl">and the portal your clients use.</span>
          </h1>
        </div>
        <p className="text-sm text-gray-400 max-w-md">
          Enterprise users land on Master Catalog with only the products they created.
          Clients open the Hub portal to browse published offerings.
        </p>
      </aside>

      <main className="flex items-center justify-center p-6 sm:p-10">
        <form onSubmit={onSubmit} className="w-full max-w-md bg-white rounded-3xl border border-black/5 shadow-sm p-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Sign in</p>
          <h2 className="mt-2 text-2xl font-extrabold text-gray-950">Welcome back</h2>
          <p className="mt-1 text-sm text-gray-500">Choose your workspace, then continue with your account.</p>

          <div className="mt-6 grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
            {(['enterprise', 'client'] as PortalRole[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => switchRole(item)}
                className={`py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                  role === item ? 'bg-black text-white' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <label className="block mt-6 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900"
              autoComplete="username"
              required
            />
          </label>

          <label className="block mt-4 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900"
              autoComplete="current-password"
              required
            />
          </label>

          {error && (
            <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-black text-white text-sm font-semibold py-3 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : role === 'enterprise' ? 'Enter Master Catalog' : 'Enter Client Portal'}
          </button>

          <div className="mt-5 text-xs text-gray-500 space-y-1">
            <p>Enterprise demo: enterprise@hubinterior.com / Enterprise@123</p>
            <p>Client demo: client@hubinterior.com / Client@123</p>
          </div>
        </form>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7F2]" />}>
      <LoginForm />
    </Suspense>
  );
}
