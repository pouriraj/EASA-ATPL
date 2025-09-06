
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const { jobId } = params;

    // Update job status to stopped
    const job = await prisma.extractionJob.update({
      where: { id: jobId },
      data: { 
        status: 'failed', // Using 'failed' status for stopped jobs
        endTime: new Date()
      }
    });

    // Log the stop
    await prisma.extractionLog.create({
      data: {
        jobId,
        level: 'warning',
        message: 'Extraction job stopped by user',
        details: `Job "${job.name}" was manually stopped`
      }
    });

    return NextResponse.json({ success: true, job });
    
  } catch (error) {
    console.error('Error stopping extraction job:', error);
    return NextResponse.json(
      { error: 'Failed to stop extraction job' },
      { status: 500 }
    );
  }
}
