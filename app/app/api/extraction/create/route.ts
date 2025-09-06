
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import type { ATPLCredentials, UserSettings } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, subjects, credentials, settings }: {
      name: string;
      subjects: string[];
      credentials: ATPLCredentials;
      settings: UserSettings;
    } = body;

    // Validate required fields
    if (!name || !subjects || subjects.length === 0 || !credentials) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Estimate total questions (in real implementation, this would query the ATPL API)
    const estimatedQuestions = subjects.length * 1200; // Mock estimate

    // Debug logging
    console.log('DEBUG - Before join:', subjects);
    const subjectsString = subjects.join(',');
    console.log('DEBUG - After join:', subjectsString);
    
    // Create extraction job in database
    const job = await prisma.extractionJob.create({
      data: {
        name,
        subjects: subjectsString,
        username: credentials.username,
        database: settings.database || 'EASA 2020',
        totalQuestions: estimatedQuestions,
        status: 'pending'
      }
    });

    // Create initial log entry
    await prisma.extractionLog.create({
      data: {
        jobId: job.id,
        level: 'info',
        message: `Extraction job "${name}" created successfully`,
        details: `Selected subjects: ${subjects.join(', ')}`
      }
    });

    return NextResponse.json(job);
    
  } catch (error) {
    console.error('Error creating extraction job:', error);
    return NextResponse.json(
      { error: 'Failed to create extraction job' },
      { status: 500 }
    );
  }
}
