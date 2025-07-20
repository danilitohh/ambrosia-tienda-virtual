import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function createCategories() {
  try {
    console.log('Creating categories...');

    const categories = [
      {
        name: 'Brownies',
        description: 'Deliciosos brownies artesanales',
        slug: 'brownies',
        image: ''
      },
      {
        name: 'Galletas',
        description: 'Galletas caseras y artesanales',
        slug: 'galletas',
        image: ''
      },
      {
        name: 'Chocolates',
        description: 'Chocolates artesanales y gourmet',
        slug: 'chocolates',
        image: ''
      },
      {
        name: 'Postres',
        description: 'Postres especiales y únicos',
        slug: 'postres',
        image: ''
      }
    ];

    for (const category of categories) {
      const existing = await prisma.category.findUnique({
        where: { slug: category.slug }
      });

      if (!existing) {
        await prisma.category.create({
          data: category
        });
        console.log(`Created category: ${category.name}`);
      } else {
        console.log(`Category already exists: ${category.name}`);
      }
    }

    console.log('Categories creation completed!');
  } catch (error) {
    console.error('Error creating categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createCategories(); 