
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Owner from '@/models/Owner';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-this';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    const owner = await Owner.findOne({ email: email.toLowerCase() });
    if (!owner) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Create JWT
    const token = jwt.sign(
      { userId: owner._id, email: owner.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    const response = NextResponse.json({ 
        message: 'Login successful',
        owner: { email: owner.email }
    });

    // Set secure cookie
    response.cookies.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400, // 1 day
        path: '/',
    });

    return response;

  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
