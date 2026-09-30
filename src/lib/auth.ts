import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-this';

export async function verifyAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token');
    if (!token || !token.value) return false;

    jwt.verify(token.value, JWT_SECRET);
    return true;
  } catch (error) {
    return false;
  }
}
