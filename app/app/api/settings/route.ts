
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import type { UserSettings } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const settings: UserSettings = await request.json();
    
    // In a real implementation, you would get the user ID from the session
    const userId = 'default_user'; // Mock user ID

    // Upsert user settings
    const savedSettings = await prisma.userSettings.upsert({
      where: { userId },
      update: settings,
      create: {
        userId,
        ...settings
      }
    });

    return NextResponse.json(savedSettings);
    
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // In a real implementation, you would get the user ID from the session
    const userId = 'default_user'; // Mock user ID

    const settings = await prisma.userSettings.findUnique({
      where: { userId }
    });

    if (!settings) {
      // Return default settings
      const defaultSettings: UserSettings = {
        retryAttempts: 3,
        delayBetweenRequests: 1000,
        timeoutDuration: 30000,
        enableMediaExtraction: true,
        outputFormat: 'excel',
        database: 'EASA 2020',
        spreadsheetLayout: 'by_subject',
        includeExplanations: true,
        includeComments: true,
        includeMediaFiles: true,
        mediaDownloadFormat: 'original'
      };
      return NextResponse.json(defaultSettings);
    }

    return NextResponse.json({
      retryAttempts: settings.retryAttempts,
      delayBetweenRequests: settings.delayBetweenRequests,
      timeoutDuration: settings.timeoutDuration,
      enableMediaExtraction: settings.enableMediaExtraction,
      outputFormat: settings.outputFormat,
      database: settings.database || 'EASA 2020',
      spreadsheetLayout: settings.spreadsheetLayout || 'by_subject',
      includeExplanations: settings.includeExplanations ?? true,
      includeComments: settings.includeComments ?? true,
      includeMediaFiles: settings.includeMediaFiles ?? true,
      mediaDownloadFormat: settings.mediaDownloadFormat || 'original'
    });
    
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}
