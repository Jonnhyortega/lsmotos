
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Customer from '@/models/Customer';
import { sendEmail } from '@/lib/sendEmail';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Basic validation
    if (!body.email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Identify if Distributor or plain Newsletter
    // We assume the frontend sends 'type' or we default based on form
    // If body.isDistributor is true, we set type = Distributor
    
    const customerType = body.type || (body.isDistributor ? 'Distributor' : 'Newsletter');

    // Check for duplicate
    const existing = await Customer.findOne({ email: body.email });
    if (existing) {
       // Ideally we might want to update their info if they re-subscribe?
       // For now, let's just return success saying "Already registered" to not leak info
       return NextResponse.json(
        { error: 'El correo ya está registrado en nuestra base de datos.' },
        { status: 409 }
      );
    }

    const newCustomer = await Customer.create({
        name: body.name || 'Subscriber',
        email: body.email,
        city: body.city || '',
        phone: body.phone || '',
        company: body.company || '',
        message: body.message || '',
        type: customerType
    });

    // Send Notification Email
    try {
        const notificationHtml = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #000; border-bottom: 2px solid #E63946; padding-bottom: 10px;">Nuevo Distribuidor Registrado</h2>
                <p>Has recibido una nueva solicitud de distribuidor desde la web.</p>
                
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <tr style="background-color: #f9f9f9;">
                        <td style="padding: 10px; font-weight: bold;">Nombre:</td>
                        <td style="padding: 10px;">${newCustomer.name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; font-weight: bold;">Email:</td>
                        <td style="padding: 10px;"><a href="mailto:${newCustomer.email}">${newCustomer.email}</a></td>
                    </tr>
                    <tr style="background-color: #f9f9f9;">
                        <td style="padding: 10px; font-weight: bold;">Teléfono:</td>
                        <td style="padding: 10px;">${newCustomer.phone || '-'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; font-weight: bold;">Empresa:</td>
                        <td style="padding: 10px;">${newCustomer.company || '-'}</td>
                    </tr>
                    <tr style="background-color: #f9f9f9;">
                        <td style="padding: 10px; font-weight: bold;">Ciudad / Provincia:</td>
                        <td style="padding: 10px;">${newCustomer.city || '-'}</td>
                    </tr>
                </table>

                <div style="margin-top: 20px; padding: 15px; background-color: #fafafa; border-left: 4px solid #333;">
                    <strong>Mensaje:</strong><br/>
                    ${newCustomer.message || 'Sin mensaje.'}
                </div>

                <p style="margin-top: 30px; font-size: 12px; color: #666;">
                    Este correo se generó automáticamente desde lsmotos.com.
                    Para ver el perfil del usuario, ingresa a <a href="https://lsmotos.com/admin">https://lsmotos.com/admin</a>
                </p>
            </div>
        `;

        await sendEmail(
            'lsmotosgeneralroca@gmail.com', 
            `🔔 Nuevo Lead: ${newCustomer.name}`, 
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
