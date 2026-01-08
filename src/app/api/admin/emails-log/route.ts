import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import EmailLog from '@/models/EmailLog';

export async function GET() {
  try {
    await connectDB();
    
    // Fetch logs from DB, sorted by date desc
    const logs = await EmailLog.find().sort({ date: -1 }).limit(50);
    
    // Map to simple structure if needed or return direct
    // Frontend expects: id, subject, message, recipients, status, date
    const formattedLogs = logs.map(log => ({
        id: log._id.toString(),
        subject: log.subject,
        message: log.message,
        recipients: log.recipients,
        status: log.status,
        date: log.date
    }));

    return NextResponse.json(formattedLogs);
  } catch (error) {
    console.error('Error fetching email logs:', error);
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}
