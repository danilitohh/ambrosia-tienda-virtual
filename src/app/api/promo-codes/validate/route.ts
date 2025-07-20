import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, cartItems } = body;

    if (!code || !cartItems || !Array.isArray(cartItems)) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    // Buscar el código promocional
    const promoCode = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() },
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

    if (!promoCode) {
      return NextResponse.json({ error: 'Código promocional no válido' }, { status: 404 });
    }

    // Verificar si está activo
    if (!promoCode.isActive) {
      return NextResponse.json({ error: 'Código promocional inactivo' }, { status: 400 });
    }

    // Verificar si ha expirado
    if (promoCode.expiresAt && new Date() > promoCode.expiresAt) {
      return NextResponse.json({ error: 'Código promocional expirado' }, { status: 400 });
    }

    // Verificar límite de usos
    if (promoCode.maxUses && promoCode.usedCount >= promoCode.maxUses) {
      return NextResponse.json({ error: 'Código promocional agotado' }, { status: 400 });
    }

    // Buscar el producto específico en el carrito
    const targetCartItem = cartItems.find((item: any) => item.productId === promoCode.productId);

    if (!targetCartItem) {
      return NextResponse.json({ 
        error: `Este código aplica solo para ${promoCode.product.name}` 
      }, { status: 400 });
    }

    // Verificar cantidad mínima
    if (targetCartItem.quantity < promoCode.minQuantity) {
      return NextResponse.json({ 
        error: `Se requieren al menos ${promoCode.minQuantity} unidades de ${promoCode.product.name}` 
      }, { status: 400 });
    }

    // Calcular el descuento
    const productPrice = parseFloat(promoCode.product.price.toString());
    const discountAmount = (productPrice * promoCode.discountPercent / 100) * targetCartItem.quantity;

    return NextResponse.json({
      valid: true,
      promoCode: {
        id: promoCode.id,
        code: promoCode.code,
        description: promoCode.description,
        discountPercent: promoCode.discountPercent,
        productName: promoCode.product.name,
        minQuantity: promoCode.minQuantity,
        discountAmount: Math.round(discountAmount * 100) / 100, // Redondear a 2 decimales
      }
    });

  } catch (error) {
    console.error('Error validating promo code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 