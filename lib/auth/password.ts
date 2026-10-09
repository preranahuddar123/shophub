import bcrypt from 'bcryptjs';

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, stored?: string | null) {
  if (!stored) return false;
  if (stored.startsWith('$2a$') || stored.startsWith('$2b$') || stored.startsWith('$2y$')) {
    return bcrypt.compare(plain, stored);
  }
  return stored === plain;
}
