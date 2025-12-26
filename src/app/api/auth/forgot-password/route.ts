
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Owner from '@/models/Owner';
import crypto from 'crypto';
import { sendEmail } from '@/lib/sendEmail';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email } = await req.json();

    const owner = await Owner.findOne({ email: email.toLowerCase() });
    if (!owner) {
      // Security: Don't reveal if user exists
      return NextResponse.json({ message: 'If the email exists, a reset link has been sent.' });
    }

    // Generate Request Token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Save to DB
    owner.resetToken = resetToken;
    owner.resetTokenExpiry = resetTokenExpiry;
    await owner.save();

    // Create Reset Link
    // Assumes localhost or vercel URL. In prod better to use process.env.NEXT_PUBLIC_APP_URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/admin/reset-password?token=${resetToken}`;

    const message = `
      <h1>Recuperación de Contraseña</h1>
      <p>Has solicitado restablecer tu contraseña para el panel de administración de Motos LS.</p>
      <p>Haz clic en el siguiente enlace para continuar:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>Este enlace expirará en 1 hora.</p>
    `;

    try {
        await sendEmail(owner.email, 'Recuperación de Contraseña - Motos LS', message);
        return NextResponse.json({ message: 'Email sent' });
    } catch (emailError) {
        owner.resetToken = undefined;
        owner.resetTokenExpiry = undefined;
        await owner.save();
        return NextResponse.json({ error: 'Email could not be sent' }, { status: 500 });
    }

  } catch (error) {
    console.error('Forgot Password Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
