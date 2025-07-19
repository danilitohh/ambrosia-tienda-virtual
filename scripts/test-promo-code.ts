import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function testPromoCode() {
  try {
    // Buscar el código promocional
    const promoCode = await prisma.promoCode.findUnique({
      where: { code: 'BROWNIE10' },
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
      console.log('No se encontró el código promocional BROWNIE10');
      return;
    }

    console.log('🔍 Probando código promocional:');
    console.log(`Código: ${promoCode.code}`);
    console.log(`Producto: ${promoCode.product.name}`);
    console.log(`Precio: $${promoCode.product.price}`);
    console.log(`Cantidad mínima: ${promoCode.minQuantity}`);
    console.log(`Descuento: ${promoCode.discountPercent}%`);

    // Simular diferentes escenarios de carrito
    const scenarios = [
      {
        name: 'Sin el producto específico',
        cartItems: [
          { productId: 'otro-producto', quantity: 1 }
        ]
      },
      {
        name: 'Con el producto pero cantidad insuficiente (x2)',
        cartItems: [
          { productId: promoCode.productId, quantity: 2 }
        ]
      },
      {
        name: 'Con el producto y cantidad correcta (x3)',
        cartItems: [
          { productId: promoCode.productId, quantity: 3 }
        ]
      },
      {
        name: 'Con el producto y cantidad mayor (x5)',
        cartItems: [
          { productId: promoCode.productId, quantity: 5 }
        ]
      }
    ];

    for (const scenario of scenarios) {
      console.log(`\n📋 Escenario: ${scenario.name}`);
      
      try {
        const response = await fetch('http://localhost:3000/api/promo-codes/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: promoCode.code,
            cartItems: scenario.cartItems
          })
        });

        const data = await response.json();

        if (response.ok && data.valid) {
          console.log(`✅ Válido - Descuento: $${data.promoCode.discountAmount.toLocaleString('es-CO')}`);
        } else {
          console.log(`❌ Inválido - ${data.error}`);
        }
      } catch (error) {
        console.log(`❌ Error: ${error}`);
      }
    }

  } catch (error) {
    console.error('Error probando código promocional:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPromoCode(); 