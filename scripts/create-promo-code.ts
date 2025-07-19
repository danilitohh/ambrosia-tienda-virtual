import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function createPromoCode() {
  try {
    // Buscar el producto "Brownie de Chocolate" (asumiendo que existe)
    const product = await prisma.product.findFirst({
      where: {
        name: {
          contains: 'Brownie',
          mode: 'insensitive'
        }
      }
    });

    if (!product) {
      console.log('No se encontró un producto con "Brownie" en el nombre');
      console.log('Productos disponibles:');
      const products = await prisma.product.findMany({
        select: { id: true, name: true, price: true }
      });
      products.forEach(p => console.log(`- ${p.name} ($${p.price})`));
      return;
    }

    // Crear código promocional
    const promoCode = await prisma.promoCode.create({
      data: {
        code: 'BROWNIE10',
        description: '10% de descuento en Brownie de Chocolate x3',
        discountPercent: 10,
        productId: product.id,
        minQuantity: 3,
        maxUses: 100,
        isActive: true,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
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

    console.log('✅ Código promocional creado exitosamente:');
    console.log(`Código: ${promoCode.code}`);
    console.log(`Descripción: ${promoCode.description}`);
    console.log(`Producto: ${promoCode.product.name}`);
    console.log(`Precio original: $${promoCode.product.price}`);
    console.log(`Cantidad mínima: ${promoCode.minQuantity}`);
    console.log(`Descuento: ${promoCode.discountPercent}%`);
    console.log(`Precio con descuento: $${(Number(promoCode.product.price) * 0.9).toFixed(0)}`);
    console.log(`Expira: ${promoCode.expiresAt?.toLocaleDateString('es-CO')}`);

  } catch (error) {
    console.error('Error creando código promocional:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createPromoCode(); 