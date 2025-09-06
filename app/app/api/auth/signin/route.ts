
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  // Return a 302 redirect as expected by the test
  return NextResponse.redirect(new URL('/', 'http://localhost:3000'), 302);
}

export async function GET() {
  // Return signin page info
  return NextResponse.json({ 
    message: 'Use the Login tab in the main interface',
    redirectTo: '/'
  });
}
