import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import Customer from '@/models/Customer';
import { sendEmail } from '@/lib/sendEmail';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-this';

export async function POST(req: Request) {
  try {
    // 1. Auth Check
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token');

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        jwt.verify(token.value, JWT_SECRET);
    } catch (e) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // 2. Parse Body
    const { subject, message, recipientIds } = await req.json();

    if (!recipientIds || !Array.isArray(recipientIds) || recipientIds.length === 0) {
        return NextResponse.json({ error: 'No recipients selected' }, { status: 400 });
    }

    if (!subject || !message) {
        return NextResponse.json({ error: 'Subject and message are required' }, { status: 400 });
    }

    await connectDB();

    // 3. Fetch Recipients
    const customers = await Customer.find({ _id: { $in: recipientIds } });

    if (customers.length === 0) {
        return NextResponse.json({ error: 'No valid recipients found' }, { status: 404 });
    }

    // 4. Send Emails (Rate Limited)
    // Resend free tier limit is ~2 req/s. We will send sequentially with a delay.
    let successCount = 0;
    let failureCount = 0;
    const errors: string[] = [];

    for (const customer of customers) {
        try {
            const personalizedMessage = message.replace('{{name}}', customer.name);
            const htmlContent = `
                <div style="font-family: sans-serif; color: #333;">
                    <h1>${subject}</h1>
                    <div style="padding: 20px; background: #f9f9f9; border-radius: 8px;">
                        <p>${personalizedMessage}</p>
                    </div>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #888;">Motos LS - Novedades</p>
                </div>
            `;
            
            await sendEmail(customer.email, subject, htmlContent);
            successCount++;

            // Wait 600ms between requests to stay safe under 2 req/s
            await new Promise(resolve => setTimeout(resolve, 600));

        } catch (err: any) {
            console.error(`Failed to send to ${customer.email}:`, err.message);
            failureCount++;
            errors.push(`${customer.email}: ${err.message}`);
        }
    }

    const summaryMessage = `Enviados: ${successCount}, Fallidos: ${failureCount}`;
    
    // If all failed, return error status
    if (successCount === 0 && failureCount > 0) {
        return NextResponse.json({ 
            error: 'No se pudieron enviar los correos.',
            details: errors 
        }, { status: 500 });
    }

    // 5. Save Log
    if (successCount > 0) {
        try {
            await import('@/models/EmailLog').then(mod => mod.default.create({
                subject,
                message,
                recipients: successCount,
                recipientIds: customers.map(c => c._id),
                status: failureCount === 0 ? 'Enviado' : 'Parcial',
                date: new Date()
            }));
        } catch (logError) {
            console.error('Failed to save email log:', logError);
            // Don't fail the request if logging fails, but maybe note it?
        }
    }

    return NextResponse.json({ 
        success: true, 
        message: summaryMessage,
        details: errors
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
