import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function createSampleProducts() {
  try {
    console.log('Creating sample products...');

    // Get categories
    const browniesCategory = await prisma.category.findUnique({ where: { slug: 'brownies' } });
    const galletasCategory = await prisma.category.findUnique({ where: { slug: 'galletas' } });
    const chocolatesCategory = await prisma.category.findUnique({ where: { slug: 'chocolates' } });

    if (!browniesCategory || !galletasCategory || !chocolatesCategory) {
      console.error('Categories not found. Please run create-categories.ts first.');
      return;
    }

    const sampleProducts = [
      {
        name: 'Brownie de Chocolate Clásico',
        description: 'Delicioso brownie de chocolate con nueces, perfecto para cualquier ocasión',
        price: 15000,
        comparePrice: 18000,
        stock: 50,
        categoryId: browniesCategory.id,
        sku: 'BRW-CHOC-001',
        slug: 'brownie-chocolate-clasico',
        images: ['/producto1.jpeg'],
        isActive: true
      },
      {
        name: 'Brownie de Chocolate x2',
        description: 'Pack de 2 brownies de chocolate premium',
        price: 25000,
        comparePrice: 30000,
        stock: 30,
        categoryId: browniesCategory.id,
        sku: 'BRW-CHOC-002',
        slug: 'brownie-chocolate-x2',
        images: ['/producto2.jpeg'],
        isActive: true
      },
      {
        name: 'Galletas de Avena',
        description: 'Galletas caseras de avena con pasas y miel',
        price: 12000,
        stock: 40,
        categoryId: galletasCategory.id,
        sku: 'GLT-AVE-001',
        slug: 'galletas-avena',
        images: ['/producto3.jpeg'],
        isActive: true
      },
      {
        name: 'Chocolates Artesanales',
        description: 'Chocolates gourmet con diferentes sabores y rellenos',
        price: 20000,
        comparePrice: 25000,
        stock: 25,
        categoryId: chocolatesCategory.id,
        sku: 'CHOC-ART-001',
        slug: 'chocolates-artesanales',
        images: ['/producto4.jpeg'],
        isActive: true
      },
      {
        name: 'Galletas de Chocolate',
        description: 'Galletas crujientes de chocolate con chips',
        price: 10000,
        stock: 35,
        categoryId: galletasCategory.id,
        sku: 'GLT-CHOC-001',
        slug: 'galletas-chocolate',
        images: ['/producto5.jpeg'],
        isActive: true
      }
    ];

    for (const product of sampleProducts) {
      const existing = await prisma.product.findUnique({
        where: { slug: product.slug }
      });

      if (!existing) {
        await prisma.product.create({
          data: product
        });
        console.log(`Created product: ${product.name}`);
      } else {
        console.log(`Product already exists: ${product.name}`);
      }
    }

    console.log('Sample products creation completed!');
  } catch (error) {
    console.error('Error creating sample products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleProducts(); 