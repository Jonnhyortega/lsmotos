
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Owner from '@/models/Owner';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    await connectDB();

    const existingOwner = await Owner.findOne();
    if (existingOwner) {
      return NextResponse.json({ error: 'Owner already exists' }, { status: 400 });
    }

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
        return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newOwner = await Owner.create({
      email,
      password: hashedPassword,
    });

    return NextResponse.json({ message: 'Owner created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Seed Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
