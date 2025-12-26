
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Owner from '@/models/Owner';

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) return NextResponse.json({ error: 'Token required' }, { status: 400 });

    await connectDB();
    const owner = await Owner.findOne({
        emailChangeToken: token,
        emailChangeTokenExpiry: { $gt: Date.now() }
    });

    if (!owner) {
        return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    // Apply Change
    owner.email = owner.newEmail!;
    owner.newEmail = undefined;
    owner.emailChangeToken = undefined;
    owner.emailChangeTokenExpiry = undefined;
    
    await owner.save();

    return NextResponse.json({ message: 'Email updated successfully' });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
