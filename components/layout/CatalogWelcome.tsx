'use client';

import { firstNameFrom, useCurrentUser } from '@/lib/auth/useCurrentUser';

export default function CatalogWelcome() {
  const user = useCurrentUser();
  const firstName = firstNameFrom(user);

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-extrabold text-gray-950 tracking-tight">
        Welcome, {firstName}
      </h1>
    </div>
  );
}
