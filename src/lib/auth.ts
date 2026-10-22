import { cookies } from 'next/headers';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

export const SESSION_COOKIE = 'truth_session';

export function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function createSessionToken(userId: string) {
  const secret = process.env.AUTH_SECRET || 'truth-dev-secret';
  return crypto.createHmac('sha256', secret).update(userId).digest('hex');
}

export async function getCurrentUser() {
  const rawCookie = cookies().get(SESSION_COOKIE)?.value;

  if (!rawCookie) {
    return null;
  }

  const [userId, token] = rawCookie.split('.');

  if (!userId || !token) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true },
  });

  if (!user) {
    return null;
  }

  if (token !== createSessionToken(user.id)) {
    return null;
  }

  return user;
}
