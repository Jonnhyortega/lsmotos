
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Customer from '@/models/Customer';
import { sendEmail } from '@/lib/sendEmail';
import {
  escapeHtml,
  getClientIp,
  isRateLimited,
  looksLikeGibberish,
  normalizeEmail,
  verifyTurnstile,
} from '@/lib/antiSpam';

const MIN_FILL_TIME_MS = 3000;
const MAX_SUBMISSIONS_PER_HOUR = 5;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_REGEX = /^[\p{L}][\p{L}\s'.-]{1,59}$/u;

const str = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

const badRequest = (error: string) => NextResponse.json({ error }, { status: 400 });

// Bots get the same answer as a real signup so they can't tell they were filtered
const fakeSuccess = () =>
  NextResponse.json({ success: true, message: 'Successfully subscribed' }, { status: 201 });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ip = getClientIp(request);

    // Honeypot: hidden field that only bots fill in
    if (str(body.website)) {
      console.warn('Subscribe blocked (honeypot):', ip);
      return fakeSuccess();
    }

    // Humans take more than a few seconds to fill the form
    const startedAt = Number(body.startedAt);
    if (!startedAt || Date.now() - startedAt < MIN_FILL_TIME_MS) {
      console.warn('Subscribe blocked (too fast):', ip);
      return fakeSuccess();
    }

    if (!(await verifyTurnstile(str(body.turnstileToken), ip))) {
      return badRequest('No pudimos verificar que seas una persona. Recargá la página e intentá de nuevo.');
    }

    if (await isRateLimited(`subscribe:${ip}`, MAX_SUBMISSIONS_PER_HOUR)) {
      return NextResponse.json(
        { error: 'Demasiados intentos. Probá de nuevo en una hora.' },
        { status: 429 }
      );
    }

    const customerType = body.type === 'Distributor' ? 'Distributor' : 'Newsletter';
    const name = str(body.name);
    const email = str(body.email).toLowerCase();
    const phone = str(body.phone);
    const city = str(body.city);
    const company = str(body.company);
    const message = str(body.message);

    if (!email || email.length > 254 || !EMAIL_REGEX.test(email)) {
      return badRequest('Ingresá un email válido.');
    }
    if (!NAME_REGEX.test(name) || looksLikeGibberish(name)) {
      return badRequest('Ingresá tu nombre real (solo letras).');
    }
    if (customerType === 'Distributor') {
      const phoneDigits = phone.replace(/\D/g, '');
      if (phoneDigits.length < 8 || phoneDigits.length > 15) {
        return badRequest('Ingresá un teléfono válido.');
      }
    }
    if (city.length > 120 || company.length > 120 || message.length > 2000) {
      return badRequest('Alguno de los campos es demasiado largo.');
    }

    await connectDB();

    // Check for duplicate (also catches gmail dot / plus aliases of an existing address)
    const emailNormalized = normalizeEmail(email);
    const existing = await Customer.findOne({
      $or: [{ email }, { emailNormalized }],
    });
    if (existing) {
      return NextResponse.json(
        { error: 'El correo ya está registrado en nuestra base de datos.' },
        { status: 409 }
      );
    }

    const newCustomer = await Customer.create({
        name,
        email,
        emailNormalized,
        city,
        phone,
        company,
        message,
        type: customerType
    });

    // Send Notification Email
    try {
        const safe = {
            name: escapeHtml(newCustomer.name),
            email: escapeHtml(newCustomer.email),
            phone: escapeHtml(newCustomer.phone || '-'),
            company: escapeHtml(newCustomer.company || '-'),
            city: escapeHtml(newCustomer.city || '-'),
            message: newCustomer.message ? escapeHtml(newCustomer.message).replace(/\n/g, '<br/>') : 'Sin mensaje.',
        };

        const notificationHtml = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #000; border-bottom: 2px solid #E63946; padding-bottom: 10px;">Nuevo Distribuidor Registrado</h2>
                <p>Has recibido una nueva solicitud de distribuidor desde la web.</p>

                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <tr style="background-color: #f9f9f9;">
                        <td style="padding: 10px; font-weight: bold;">Nombre:</td>
                        <td style="padding: 10px;">${safe.name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; font-weight: bold;">Email:</td>
                        <td style="padding: 10px;"><a href="mailto:${safe.email}">${safe.email}</a></td>
                    </tr>
                    <tr style="background-color: #f9f9f9;">
                        <td style="padding: 10px; font-weight: bold;">Teléfono:</td>
                        <td style="padding: 10px;">${safe.phone}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; font-weight: bold;">Empresa:</td>
                        <td style="padding: 10px;">${safe.company}</td>
                    </tr>
                    <tr style="background-color: #f9f9f9;">
                        <td style="padding: 10px; font-weight: bold;">Ciudad / Provincia:</td>
                        <td style="padding: 10px;">${safe.city}</td>
                    </tr>
                </table>

                <div style="margin-top: 20px; padding: 15px; background-color: #fafafa; border-left: 4px solid #333;">
                    <strong>Mensaje:</strong><br/>
                    ${safe.message}
                </div>

                <p style="margin-top: 30px; font-size: 12px; color: #666;">
                    Este correo se generó automáticamente desde lsmotos.com.
                    Para ver el perfil del usuario, ingresa a <a href="https://lsmotos.com/admin">https://lsmotos.com/admin</a>
                </p>
            </div>
        `;

        // Subject is a header, not HTML: strip line breaks so it can't inject headers
        await sendEmail(
            'lsmotosgeneralroca@gmail.com',
            `🔔 Nuevo Lead: ${newCustomer.name.replace(/[\r\n]+/g, ' ')}`,
            notificationHtml
        );

    } catch (emailError) {
        console.error("Failed to send notification email:", emailError);
        // Don't fail the request if email fails, just log it
    }

    return NextResponse.json(
      { success: true, message: 'Successfully subscribed' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Subscription Error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
