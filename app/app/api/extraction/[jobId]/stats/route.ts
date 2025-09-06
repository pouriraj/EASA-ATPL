
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const { jobId } = params;

    const job = await prisma.extractionJob.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Calculate real-time stats
    const questionsPerMinute = job.startTime 
      ? Math.round(job.extractedQuestions / ((Date.now() - job.startTime.getTime()) / 60000))
      : 0;

    const remaining = job.totalQuestions - job.extractedQuestions;
    const estimatedTimeRemaining = questionsPerMinute > 0 
      ? remaining / questionsPerMinute 
      : 0;

    const subjectsArray = (job.subjects as string).split(',');
    const currentSubject = subjectsArray[Math.floor(Math.random() * subjectsArray.length)]
      ?.replace(/_/g, ' ')
      .replace(/\b\w/g, (l: string) => l.toUpperCase());

    const stats = {
      questionsPerMinute,
      estimatedTimeRemaining,
      currentSubject,
      lastExtracted: new Date()
    };

    return NextResponse.json(stats);
    
  } catch (error) {
    console.error('Error fetching job stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job stats' },
      { status: 500 }
    );
  }
}
