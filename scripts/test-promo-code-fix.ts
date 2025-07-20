import { prisma } from '../src/lib/prisma';

async function testPromoCode() {
  try {
    console.log('🔍 Probando código promocional...');
    
    // Buscar el código promocional
    const promoCode = await prisma.promoCode.findUnique({
      where: { code: 'HOLA' },
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
      console.log('❌ Código promocional HOLA no encontrado');
      return;
    }

    console.log('✅ Código promocional encontrado:');
    console.log('- Código:', promoCode.code);
    console.log('- Descripción:', promoCode.description);
    console.log('- Descuento:', promoCode.discountPercent + '%');
    console.log('- Producto:', promoCode.product.name);
    console.log('- Product ID:', promoCode.productId);
    console.log('- Cantidad mínima:', promoCode.minQuantity);
    console.log('- Estado:', promoCode.isActive ? 'Activo' : 'Inactivo');
    console.log('- Usos:', promoCode.usedCount + '/' + (promoCode.maxUses || 'Ilimitado'));

    // Simular carrito con el producto correcto
    const cartItems = [
      {
        id: promoCode.productId,
        productId: promoCode.productId,
        name: promoCode.product.name,
        price: promoCode.product.price,
        quantity: promoCode.minQuantity
      }
    ];

    console.log('\n🛒 Simulando carrito:');
    console.log('- Producto en carrito:', cartItems[0].name);
    console.log('- Product ID en carrito:', cartItems[0].productId);
    console.log('- Cantidad:', cartItems[0].quantity);

    // Verificar que el producto esté en el carrito
    const targetCartItem = cartItems.find(item => item.productId === promoCode.productId);
    
    if (targetCartItem) {
      console.log('✅ Producto encontrado en carrito');
      
      if (targetCartItem.quantity >= promoCode.minQuantity) {
        console.log('✅ Cantidad mínima cumplida');
        
        // Calcular descuento
        const discountAmount = (parseFloat(promoCode.product.price.toString()) * promoCode.discountPercent / 100) * targetCartItem.quantity;
        console.log('💰 Descuento calculado:', discountAmount.toFixed(2));
        
        console.log('🎉 ¡Código promocional válido!');
      } else {
        console.log('❌ Cantidad mínima no cumplida');
      }
    } else {
      console.log('❌ Producto no encontrado en carrito');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPromoCode(); 