
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const results = await prisma.extractionResult.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100 // Limit to recent 100 results
    });

    return NextResponse.json(results);
    
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch results' },
      { status: 500 }
    );
  }
}
