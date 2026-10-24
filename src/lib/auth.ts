import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

// Fail closed: without a real secret nobody can log in, instead of everyone being able to forge tokens
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET is missing or too short (min 32 chars)');
  }
  return secret;
}

export async function verifyAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token');
    if (!token || !token.value) return false;

    jwt.verify(token.value, getJwtSecret());
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('JWT_SECRET')) console.error(error.message);
    return false;
  }
}
