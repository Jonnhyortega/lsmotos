
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Owner from '@/models/Owner';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
        return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
    }

    const owner = await Owner.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: Date.now() }
    });

    if (!owner) {
        return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    // Set new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    owner.password = hashedPassword;
    owner.resetToken = undefined;
    owner.resetTokenExpiry = undefined;
    
    await owner.save();

    return NextResponse.json({ message: 'Password reset successful' });

  } catch (error) {
    console.error('Reset Password Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
