
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import Owner from '@/models/Owner';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-this';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token');

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Verify Token
    const decoded = jwt.verify(token.value, JWT_SECRET) as any;
    
    await connectDB();
    const owner = await Owner.findById(decoded.userId).select('email');

    if (!owner) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
        email: owner.email 
    });

  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
