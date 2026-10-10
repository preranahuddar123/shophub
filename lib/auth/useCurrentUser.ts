'use client';

import { useEffect, useState } from 'react';
import type { SessionUser } from './session';

export function useCurrentUser() {
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => {
        if (!cancelled) setUser(data?.user || null);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return user;
}

export function firstNameFrom(user?: SessionUser | null) {
  if (!user?.name) return 'there';
  return user.name.split(' ')[0] || user.name;
}

export function roleLabel(user?: SessionUser | null) {
  if (!user?.role) return '';
  if (user.role === 'admin') return 'Admin';
  if (user.role === 'enterprise') return 'Enterprise';
  if (user.role === 'crm') return 'CRM Specialist';
  if (user.role === 'designer') return 'Designer';
  return 'Client';
}
