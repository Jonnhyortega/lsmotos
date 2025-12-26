
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import Owner from '@/models/Owner';
import crypto from 'crypto';
import { sendEmail } from '@/lib/sendEmail';

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

    const { newEmail } = await req.json();

    if (!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
        return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    // Generate Token
    const changeToken = crypto.randomBytes(32).toString('hex');
    const expiry = Date.now() + 3600000; // 1 hr

    owner.newEmail = newEmail;
    owner.emailChangeToken = changeToken;
    owner.emailChangeTokenExpiry = new Date(expiry);
    await owner.save();

    // Send Verification Email to NEW email
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const verifyUrl = `${baseUrl}/admin?verify_email_token=${changeToken}`;

    const message = `
      <h1>Verificación de Cambio de Correo</h1>
      <p>Has solicitado cambiar tu correo de administrador a: <strong>${newEmail}</strong></p>
      <p>Para confirmar este cambio, haz clic en el siguiente enlace:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
    `;

    try {
        await sendEmail(newEmail, 'Verifica tu nuevo correo - Motos LS', message);
        return NextResponse.json({ message: 'Verification email sent' });
    } catch(err) {
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
