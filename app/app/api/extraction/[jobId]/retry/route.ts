
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const { jobId } = params;
    const { questionId } = await request.json();

    // Find the failed question
    const failedQuestion = await prisma.failedQuestion.findFirst({
      where: { jobId, questionId }
    });

    if (!failedQuestion) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    // Update retry count
    await prisma.failedQuestion.update({
      where: { id: failedQuestion.id },
      data: { retryCount: failedQuestion.retryCount + 1 }
    });

    // Log the retry attempt
    await prisma.extractionLog.create({
      data: {
        jobId,
        level: 'info',
        message: `Retrying failed question: ${questionId}`,
        details: `Attempt #${failedQuestion.retryCount + 1}`
      }
    });

    // In a real implementation, trigger the Python script to retry this specific question
    // For simulation, we'll just simulate success/failure
    const success = Math.random() > 0.3; // 70% success rate on retry
    
    if (success) {
      // Remove from failed questions
      await prisma.failedQuestion.delete({
        where: { id: failedQuestion.id }
      });

      // Update job stats
      await prisma.extractionJob.update({
        where: { id: jobId },
        data: {
          extractedQuestions: { increment: 1 },
          failedQuestions: { decrement: 1 }
        }
      });

      await prisma.extractionLog.create({
        data: {
          jobId,
          level: 'info',
          message: `Question ${questionId} extracted successfully on retry`
        }
      });
    } else {
      await prisma.extractionLog.create({
        data: {
          jobId,
          level: 'warning',
          message: `Retry failed for question ${questionId}`,
          details: 'Question still failing after retry attempt'
        }
      });
    }

    return NextResponse.json({ success });
    
  } catch (error) {
    console.error('Error retrying question:', error);
    return NextResponse.json(
      { error: 'Failed to retry question' },
      { status: 500 }
    );
  }
}
