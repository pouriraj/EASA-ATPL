
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const { jobId } = params;

    const failedQuestions = await prisma.failedQuestion.findMany({
      where: { jobId },
      orderBy: { timestamp: 'desc' }
    });

    return NextResponse.json(failedQuestions);
    
  } catch (error) {
    console.error('Error fetching failed questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch failed questions' },
      { status: 500 }
    );
  }
}
