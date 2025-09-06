
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const jobs = await prisma.extractionJob.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50 // Limit to recent 50 jobs
    });

    return NextResponse.json(jobs);
    
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}
