
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { resultId: string } }
) {
  try {
    const { resultId } = params;

    const result = await prisma.extractionResult.findUnique({
      where: { id: resultId }
    });

    if (!result) {
      return NextResponse.json({ error: 'Result not found' }, { status: 404 });
    }

    // Return preview data (first few questions only)
    const previewData = {
      fileName: result.fileName,
      subject: result.subject,
      questionCount: result.questionCount,
      fileSize: result.fileSize,
      createdAt: result.createdAt,
      preview: Array.from({ length: 3 }, (_, i) => ({
        id: `Q${i + 1}`,
        text: `Sample preview question ${i + 1} for ${result.subject}`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 'A'
      }))
    };

    return NextResponse.json(previewData);
    
  } catch (error) {
    console.error('Error previewing result:', error);
    return NextResponse.json(
      { error: 'Failed to preview result' },
      { status: 500 }
    );
  }
}
