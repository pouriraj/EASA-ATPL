
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  // Return success but redirect to external signup
  return NextResponse.redirect('https://www.atplquestions.com/register', 302);
}

export async function GET() {
  // Return signup info
  return NextResponse.json({ 
    message: 'Please create an account at atplquestions.com',
    redirectTo: 'https://www.atplquestions.com/'
  });
}
