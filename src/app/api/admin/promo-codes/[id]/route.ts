import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Verificar que el código promocional existe
    const promoCode = await prisma.promoCode.findUnique({
      where: { id }
    });

    if (!promoCode) {
      return NextResponse.json({ error: 'Promo code not found' }, { status: 404 });
    }

    // Eliminar el código promocional
    await prisma.promoCode.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Promo code deleted successfully' });
  } catch (error) {
    console.error('Error deleting promo code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 