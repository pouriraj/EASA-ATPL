
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Return a simple CSRF token for testing
  return NextResponse.json({ 
    csrfToken: 'test-csrf-token-' + Date.now(),
    message: 'This app uses custom authentication with atplquestions.com'
  });
}
