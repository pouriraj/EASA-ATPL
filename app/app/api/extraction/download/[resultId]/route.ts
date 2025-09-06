
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

    // In a real implementation, you would read the actual file from disk
    // For now, we'll generate mock data
    const mockData = {
      subject: result.subject,
      questionCount: result.questionCount,
      extractedAt: result.createdAt,
      questions: Array.from({ length: Math.min(result.questionCount, 10) }, (_, i) => ({
        id: `Q${i + 1}`,
        text: `Sample question ${i + 1} for ${result.subject}`,
        options: [
          { label: 'A', text: 'Option A' },
          { label: 'B', text: 'Option B' },
          { label: 'C', text: 'Option C' },
          { label: 'D', text: 'Option D' }
        ],
        correctAnswer: 'A',
        explanation: `Explanation for question ${i + 1}`
      }))
    };

    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('Content-Disposition', `attachment; filename="${result.fileName}"`);

    return new NextResponse(JSON.stringify(mockData, null, 2), {
      status: 200,
      headers
    });
    
  } catch (error) {
    console.error('Error downloading result:', error);
    return NextResponse.json(
      { error: 'Failed to download result' },
      { status: 500 }
    );
  }
}
