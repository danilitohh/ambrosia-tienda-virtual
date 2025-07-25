import { PrismaClient } from '../src/generated/prisma'
import { slugify } from '../src/lib/utils'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // Limpiar productos existentes
  await prisma.product.deleteMany({});

  // Crear productos reales de Ambrosia
  const products = [
    {
      name: 'Brownie de chocolate x2',
      description: 'Intenciona tu viaje, descubre la magia. Brownie de chocolate x2',
      price: 33000,
      comparePrice: 33000,
      sku: 'AMB-BROWNIE-X2',
      isFeatured: true,
      slug: slugify('Brownie de chocolate x2'),
      categorySlug: 'brownies',
      images: ['/producto1.jpeg'],
    },
    {
      name: 'Brownie de chocolate x3',
      description: 'Intenciona tu viaje, descubre la magia. Brownie de chocolate x3',
      price: 41900,
      comparePrice: 41900,
      sku: 'AMB-BROWNIE-X3',
      isFeatured: true,
      slug: slugify('Brownie de chocolate x3'),
      categorySlug: 'brownies',
      images: ['/producto2.jpeg'],
    },
    {
      name: 'Galletas',
      description: 'Intenciona tu viaje, descubre la magia. Galletas',
      price: 29900,
      comparePrice: 29900,
      sku: 'AMB-GALLETAS',
      isFeatured: true,
      slug: slugify('Galletas'),
      categorySlug: 'galletas',
      images: ['/producto3.jpeg'],
    },
    {
      name: 'Brownie de chocolate x1',
      description: 'Intenciona tu viaje, descubre la magia. Brownie de chocolate x1',
      price: 20000,
      comparePrice: 20000,
      sku: 'AMB-BROWNIE-X1',
      isFeatured: true,
      slug: slugify('Brownie de chocolate x1'),
      categorySlug: 'brownies',
      images: ['/producto4.jpeg'],
    },
    {
      name: 'Alfajor',
      description: 'Intenciona tu viaje, descubre la magia. Alfajor',
      price: 22000,
      comparePrice: 22000,
      sku: 'AMB-ALFAJOR',
      isFeatured: true,
      slug: slugify('Alfajor'),
      categorySlug: 'alfajores',
      images: ['/producto5.jpeg'],
    },
    {
      name: 'Chocolates',
      description: 'Intenciona tu viaje, descubre la magia. Chocolates',
      price: 29900,
      comparePrice: 29900,
      sku: 'AMB-CHOCOLATES',
      isFeatured: true,
      slug: slugify('Chocolates'),
      categorySlug: 'chocolates',
      images: ['/producto6.jpeg'],
    },
    {
      name: 'Combo armable',
      description: 'Intenciona tu viaje, descubre la magia. Combo armable',
      price: 41900,
      comparePrice: 41900,
      sku: 'AMB-COMBO',
      isFeatured: true,
      slug: slugify('Combo armable'),
      categorySlug: 'combos',
      images: ['/producto7.jpeg'],
    },
    {
      name: 'Trufas',
      description: 'Intenciona tu viaje, descubre la magia. Trufas',
      price: 29900,
      comparePrice: 29900,
      sku: 'AMB-TRUFAS',
      isFeatured: true,
      slug: slugify('Trufas'),
      categorySlug: 'trufas',
      images: ['/producto8.jpeg'],
    },
  ];

  // Crear categorías necesarias
  const ambrosiaCategories = [
    { name: 'Brownies', description: 'Brownies Ambrosia', slug: 'brownies' },
    { name: 'Galletas', description: 'Galletas Ambrosia', slug: 'galletas' },
    { name: 'Alfajores', description: 'Alfajores Ambrosia', slug: 'alfajores' },
    { name: 'Chocolates', description: 'Chocolates Ambrosia', slug: 'chocolates' },
    { name: 'Combos', description: 'Combos Ambrosia', slug: 'combos' },
    { name: 'Trufas', description: 'Trufas Ambrosia', slug: 'trufas' },
  ];

  for (const category of ambrosiaCategories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  for (const product of products) {
    const category = await prisma.category.findUnique({
      where: { slug: product.categorySlug },
    });

    if (category) {
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: {},
        create: {
          name: product.name,
          description: product.description,
          price: product.price,
          comparePrice: product.comparePrice,
          sku: product.sku,
          isFeatured: product.isFeatured,
          slug: product.slug,
          images: product.images,
          categoryId: category.id,
        },
      });
    }
  }

  console.log('✅ Productos creados')

  // Crear usuario admin de ejemplo
  const password = await bcrypt.hash('admin123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@ambrosia.com' },
    update: { password },
    create: {
      name: 'Administrador',
      email: 'admin@ambrosia.com',
      role: 'ADMIN',
      password,
    },
  })

  console.log('✅ Usuario admin creado')

  console.log('🎉 Seed completado exitosamente!')
  console.log('📧 Email admin: admin@ambrosia.com')
  console.log('🔑 Contraseña: (configurar manualmente)')
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })