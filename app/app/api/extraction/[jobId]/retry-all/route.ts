
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const { jobId } = params;
    const { questionIds } = await request.json();

    // Log the batch retry
    await prisma.extractionLog.create({
      data: {
        jobId,
        level: 'info',
        message: `Starting batch retry of ${questionIds.length} questions`
      }
    });

    let successCount = 0;
    let failureCount = 0;

    // Process each question
    for (const questionId of questionIds) {
      try {
        const failedQuestion = await prisma.failedQuestion.findFirst({
          where: { jobId, questionId }
        });

        if (!failedQuestion) continue;

        // Update retry count
        await prisma.failedQuestion.update({
          where: { id: failedQuestion.id },
          data: { retryCount: failedQuestion.retryCount + 1 }
        });

        // Simulate retry success (70% success rate)
        const success = Math.random() > 0.3;
        
        if (success) {
          await prisma.failedQuestion.delete({
            where: { id: failedQuestion.id }
          });
          successCount++;
        } else {
          failureCount++;
        }
        
      } catch (error) {
        console.error(`Error retrying question ${questionId}:`, error);
        failureCount++;
      }
    }

    // Update job stats
    if (successCount > 0) {
      await prisma.extractionJob.update({
        where: { id: jobId },
        data: {
          extractedQuestions: { increment: successCount },
          failedQuestions: { decrement: successCount }
        }
      });
    }

    // Log the results
    await prisma.extractionLog.create({
      data: {
        jobId,
        level: 'info',
        message: `Batch retry completed: ${successCount} success, ${failureCount} failures`
      }
    });

    return NextResponse.json({ successCount, failureCount });
    
  } catch (error) {
    console.error('Error in batch retry:', error);
    return NextResponse.json(
      { error: 'Failed to retry questions' },
      { status: 500 }
    );
  }
}
