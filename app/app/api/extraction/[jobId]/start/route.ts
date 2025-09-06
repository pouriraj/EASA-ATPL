
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const { jobId } = params;

    // Update job status to running
    const job = await prisma.extractionJob.update({
      where: { id: jobId },
      data: {
        status: 'running',
        startTime: new Date()
      }
    });

    // Log the start
    await prisma.extractionLog.create({
      data: {
        jobId,
        level: 'info',
        message: 'Extraction job started',
        details: `Job "${job.name}" is now running`
      }
    });

    // In a real implementation, you would spawn the Python extraction process here
    // For now, we'll simulate the extraction with a background process
    simulateExtraction(jobId);

    return NextResponse.json({ success: true, job });
    
  } catch (error) {
    console.error('Error starting extraction job:', error);
    return NextResponse.json(
      { error: 'Failed to start extraction job' },
      { status: 500 }
    );
  }
}

// Simulate extraction process (replace with actual Python script execution)
async function simulateExtraction(jobId: string) {
  try {
    const job = await prisma.extractionJob.findUnique({ where: { id: jobId } });
    if (!job) return;

    let extracted = 0;
    let failed = 0;
    const total = job.totalQuestions;

    const interval = setInterval(async () => {
      try {
        // Simulate progress
        const increment = Math.floor(Math.random() * 50) + 10;
        extracted = Math.min(extracted + increment, total);
        
        // Simulate occasional failures
        if (Math.random() < 0.05) {
          failed++;
          
          // Create failed question record
          const subjectsArray = (job.subjects as string).split(',');
          await prisma.failedQuestion.create({
            data: {
              jobId,
              questionId: `Q${extracted + failed}`,
              subject: subjectsArray[Math.floor(Math.random() * subjectsArray.length)],
              url: `https://www.atplquestions.com/question/${extracted + failed}`,
              error: 'Timeout: Request exceeded 30 second limit'
            }
          });
        }

        // Update job progress
        await prisma.extractionJob.update({
          where: { id: jobId },
          data: {
            extractedQuestions: extracted,
            failedQuestions: failed
          }
        });

        // Create progress log
        if (extracted % 100 === 0 || extracted === total) {
          await prisma.extractionLog.create({
            data: {
              jobId,
              level: 'info',
              message: `Extraction progress: ${extracted}/${total} questions`,
              details: `${Math.round((extracted / total) * 100)}% complete`
            }
          });
        }

        // Complete job when done
        if (extracted >= total) {
          clearInterval(interval);
          
          await prisma.extractionJob.update({
            where: { id: jobId },
            data: {
              status: 'completed',
              endTime: new Date()
            }
          });

          // Create completion log
          await prisma.extractionLog.create({
            data: {
              jobId,
              level: 'info',
              message: 'Extraction job completed successfully',
              details: `Total: ${extracted} extracted, ${failed} failed`
            }
          });

          // Create result records for each subject
          const subjectsArray = (job.subjects as string).split(',');
          for (const subject of subjectsArray) {
            const questionsForSubject = Math.floor(extracted / subjectsArray.length);
            await prisma.extractionResult.create({
              data: {
                jobId,
                subject,
                fileName: `${subject}_questions.json`,
                filePath: `/results/${jobId}/${subject}_questions.json`,
                fileSize: questionsForSubject * 1024, // Mock file size
                questionCount: questionsForSubject
              }
            });
          }
        }
        
      } catch (error) {
        console.error('Simulation error:', error);
        clearInterval(interval);
        
        await prisma.extractionJob.update({
          where: { id: jobId },
          data: { status: 'failed' }
        });
      }
    }, 2000); // Update every 2 seconds
    
  } catch (error) {
    console.error('Error in simulation:', error);
  }
}
