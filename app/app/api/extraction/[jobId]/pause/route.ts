
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const { jobId } = params;

    // Update job status to paused
    const job = await prisma.extractionJob.update({
      where: { id: jobId },
      data: { status: 'paused' }
    });

    // Log the pause
    await prisma.extractionLog.create({
      data: {
        jobId,
        level: 'info',
        message: 'Extraction job paused',
        details: `Job "${job.name}" has been paused by user`
      }
    });

    return NextResponse.json({ success: true, job });
    
  } catch (error) {
    console.error('Error pausing extraction job:', error);
    return NextResponse.json(
      { error: 'Failed to pause extraction job' },
      { status: 500 }
    );
  }
}
