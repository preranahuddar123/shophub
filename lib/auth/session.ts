export const SESSION_COOKIE = 'shophub_session';

export type PortalRole = 'admin' | 'enterprise' | 'client';

export type SessionUser = {
  id: number;
  email: string;
  name: string;
  role: PortalRole;
  brand?: string;
};

export function encodeSession(user: SessionUser): string {
  return Buffer.from(JSON.stringify(user), 'utf8').toString('base64url');
}

function decodeBase64Url(value: string) {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(value, 'base64url').toString('utf8');
  }
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const withPad = padded + '='.repeat((4 - (padded.length % 4)) % 4);
  return atob(withPad);
}

export function decodeSession(value?: string | null): SessionUser | null {
  if (!value) return null;
  try {
    const json = decodeBase64Url(value);
    const user = JSON.parse(json) as SessionUser;
    if (!user?.id || (user.role !== 'admin' && user.role !== 'enterprise' && user.role !== 'client')) {
      return null;
    }
    return user;
  } catch {
    return null;
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === 'production',
  };
}

export function redirectForRole(role: PortalRole) {
  return role === 'client' ? '/client' : '/offerings';
}

export function canManageCatalog(role?: PortalRole | null) {
  return role === 'admin' || role === 'enterprise';
}

export function isEnterprisePath(pathname: string) {
  return (
    pathname.startsWith('/offerings') ||
    pathname.startsWith('/enterprise') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/brands') ||
    pathname.startsWith('/categories') ||
    pathname.startsWith('/quote-engine') ||
    pathname.startsWith('/quote-making') ||
    pathname.startsWith('/master-catalog') ||
    pathname.startsWith('/import') ||
    pathname.startsWith('/settings')
  );
}

export function isClientPath(pathname: string) {
  return pathname.startsWith('/client');
}
