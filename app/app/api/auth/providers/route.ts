
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // This is a simple endpoint to satisfy testing requirements
  // The actual authentication is handled directly with atplquestions.com
  return NextResponse.json({ providers: [] });
}
