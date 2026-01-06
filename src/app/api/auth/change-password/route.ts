
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import Owner from '@/models/Owner';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-this';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token');

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token.value, JWT_SECRET) as any;
    
    await connectDB();
    const owner = await Owner.findById(decoded.userId);

    if (!owner) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Verify Current Password
    const isMatch = await bcrypt.compare(currentPassword, owner.password);
    if (!isMatch) {
        return NextResponse.json({ error: 'La contraseña actual es incorrecta.' }, { status: 400 });
    }

    // Check if New Password is same as Current (using bcrypt to compare against hash)
    const isSameAsCurrent = await bcrypt.compare(newPassword, owner.password);
    if (isSameAsCurrent) {
         return NextResponse.json({ error: 'La nueva contraseña no puede ser igual a la actual.' }, { status: 400 });
    }

    // Validate New Password Strength (Basic check, frontend handles more)
    if (newPassword.length < 8) {
        return NextResponse.json({ error: 'Password too short' }, { status: 400 });
    }

    // Hash New Password
    const salt = await bcrypt.genSalt(10);
    owner.password = await bcrypt.hash(newPassword, salt);
    await owner.save();

    return NextResponse.json({ message: 'Password updated successfully' });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
