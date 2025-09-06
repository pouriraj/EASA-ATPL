
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { resultId: string } }
) {
  try {
    const { resultId } = params;

    // In a real implementation, you would also delete the actual file
    await prisma.extractionResult.delete({
      where: { id: resultId }
    });

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error deleting result:', error);
    return NextResponse.json(
      { error: 'Failed to delete result' },
      { status: 500 }
    );
  }
}
