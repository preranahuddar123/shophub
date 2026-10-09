'use client';

import { FormEvent, Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok || !data?.success) {
        throw new Error(data?.error || 'Unable to sign in.');
      }
      const next = searchParams.get('next');
      const allowedNext =
        data.user.role === 'client'
          ? next && next.startsWith('/client')
          : next && !next.startsWith('/client') && next !== '/';
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
            Sign in with your account
            <span className="block text-gray-400 font-semibold mt-3 text-xl">
              We’ll open the workspace that matches your role.
            </span>
          </h1>
        </div>
        <p className="text-sm text-gray-400 max-w-md">
          Admin and enterprise accounts open Master Catalog. Client accounts open the Hub portal.
        </p>
      </aside>

      <main className="flex items-center justify-center p-6 sm:p-10">
        <form onSubmit={onSubmit} className="w-full max-w-md bg-white rounded-3xl border border-black/5 shadow-sm p-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Sign in</p>
          <h2 className="mt-2 text-2xl font-extrabold text-gray-950">Welcome back</h2>
          <p className="mt-1 text-sm text-gray-500">Enter your email and password to continue.</p>

          <label className="block mt-6 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
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
              placeholder="Enter your password"
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
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
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
