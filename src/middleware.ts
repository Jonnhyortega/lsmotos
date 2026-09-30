import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const allowedOrigins = [
  'https://www.lsmotos.com',
  'https://lsmotos.com',
  'https://lsmotos.vercel.app',
  'http://localhost:3000'
];

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  // Handle preflight "OPTIONS" request
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 200 });
    
    if (origin && (allowedOrigins.includes(origin) || origin.includes('localhost'))) {
        response.headers.set('Access-Control-Allow-Origin', origin);
        response.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT,OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        response.headers.set('Access-Control-Allow-Credentials', 'true');
    }
    
    return response;
  }

  const response = NextResponse.next();

  if (origin && (allowedOrigins.includes(origin) || origin.includes('localhost'))) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT,OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  // Security Headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: ['/api/:path*'],
};
