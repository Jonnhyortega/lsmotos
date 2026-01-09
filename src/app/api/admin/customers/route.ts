
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
      phone: doc.phone || '',
      company: doc.company || '',
      message: doc.message || '',
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

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { ids } = await request.json();
    console.log("DELETE request received for IDs:", ids);

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'No IDs provided' },
        { status: 400 }
      );
    }

    const result = await Customer.deleteMany({ _id: { $in: ids } });
    console.log("Delete result:", result);

    return NextResponse.json(
      { success: true, message: 'Customers deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete customers', details: error.message },
      { status: 500 }
    );
  }
}
