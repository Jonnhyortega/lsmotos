
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Customer from '@/models/Customer';

export async function GET() {
  try {
    await connectDB();
    
    // Fetch all customers, sorted by newest first
    const customers = await Customer.find({}).sort({ createdAt: -1 });
    
    // Map to frontend interface if needed (though our model matches mostly)
    const formattedCustomers = customers.map(doc => ({
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      city: doc.city || 'N/A',
      type: doc.type,
      date: doc.createdAt.toISOString(),
    }));

    return NextResponse.json(formattedCustomers);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Basic validation
    if (!body.email || !body.name) {
      return NextResponse.json(
        { error: 'Name and Email are required' },
        { status: 400 }
      );
    }

    // Check for duplicate
    const existing = await Customer.findOne({ email: body.email });
    if (existing) {
       return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }

    const newCustomer = await Customer.create(body);

    return NextResponse.json(
      { success: true, data: newCustomer },
      { status: 201 }
    );
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}
