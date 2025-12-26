
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Customer from '@/models/Customer';

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
        { success: true, message: 'Already subscribed' },
        { status: 200 }
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
