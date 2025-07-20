import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { code, description, discountPercent, productId, minQuantity, maxUses, expiresAt } = body;

    // Validaciones
    if (!code || !description || !discountPercent || !productId || !minQuantity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (discountPercent < 1 || discountPercent > 100) {
      return NextResponse.json({ error: 'Discount percent must be between 1 and 100' }, { status: 400 });
    }

    if (minQuantity < 1) {
      return NextResponse.json({ error: 'Minimum quantity must be at least 1' }, { status: 400 });
    }

    // Verificar que el producto existe
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Verificar que el código no existe
    const existingCode = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (existingCode) {
      return NextResponse.json({ error: 'Promo code already exists' }, { status: 400 });
    }

    // Crear el código promocional
    const promoCode = await prisma.promoCode.create({
      data: {
        code: code.toUpperCase(),
        description,
        discountPercent,
        productId,
        minQuantity,
        maxUses: maxUses || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
          }
        }
      }
    });

    return NextResponse.json(promoCode);
  } catch (error) {
    console.error('Error creating promo code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const promoCodes = await prisma.promoCode.findMany({
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(promoCodes);
  } catch (error) {
    console.error('Error fetching promo codes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 