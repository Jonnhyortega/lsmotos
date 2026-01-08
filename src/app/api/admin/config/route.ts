import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SiteConfig from '@/models/SiteConfig';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    
    // Find the first (and ideally only) config document
    let config = await SiteConfig.findOne();

    // If no config exists yet, create a default one
    if (!config) {
      config = await SiteConfig.create({});
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error('Error fetching site config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch site configuration' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    // Upsert: update the first document found, or create if new
    // We use findOneAndUpdate with upsert: true options
    const config = await SiteConfig.findOneAndUpdate(
      {}, // filter (empty matches any, effectively picking the first one)
      { 
        $set: {
          whatsapp: body.whatsapp,
          instagram: body.instagram,
          email: body.email,
          facebook: body.facebook,
          address: body.address,
          mapsLink: body.mapsLink,
          tiktok: body.tiktok,
          showWhatsapp: body.showWhatsapp,
          showInstagram: body.showInstagram,
          showFacebook: body.showFacebook,
          showTiktok: body.showTiktok,
          showEmail: body.showEmail,
          showAddress: body.showAddress,
          showMapsLink: body.showMapsLink,
          updatedAt: new Date()
        } 
      },
      { 
        new: true,   // return the new doc
        upsert: true // create if not exists
      }
    );

    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error('Error updating site config:', error);
    return NextResponse.json(
      { error: 'Failed to update site configuration' },
      { status: 500 }
    );
  }
}
