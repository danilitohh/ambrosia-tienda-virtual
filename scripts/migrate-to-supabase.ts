import { PrismaClient } from '../src/generated/prisma'

const localPrisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://daniloherrera@localhost:5432/ambrosia'
    }
  }
})

const supabasePrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.SUPABASE_DATABASE_URL || 'postgresql://postgres.fmdnopkzeisopsohrzrq:Tr3scorazon!@aws-0-us-east-2.pooler.supabase.com:6543/postgres'
    }
  }
})

async function migrateData() {
  try {
    console.log('🚀 Iniciando migración de datos...')

    // Migrar categorías
    console.log('📂 Migrando categorías...')
    const categories = await localPrisma.category.findMany()
    for (const category of categories) {
      await supabasePrisma.category.upsert({
        where: { id: category.id },
        update: category,
        create: category
      })
    }
    console.log(`✅ ${categories.length} categorías migradas`)

    // Migrar productos
    console.log('📦 Migrando productos...')
    const products = await localPrisma.product.findMany()
    for (const product of products) {
      await supabasePrisma.product.upsert({
        where: { id: product.id },
        update: product,
        create: product
      })
    }
    console.log(`✅ ${products.length} productos migrados`)

    // Migrar usuarios
    console.log('👥 Migrando usuarios...')
    const users = await localPrisma.user.findMany()
    for (const user of users) {
      await supabasePrisma.user.upsert({
        where: { id: user.id },
        update: user,
        create: user
      })
    }
    console.log(`✅ ${users.length} usuarios migrados`)

    // Migrar configuraciones
    console.log('⚙️ Migrando configuraciones...')
    const settings = await localPrisma.settings.findMany()
    for (const setting of settings) {
      await supabasePrisma.settings.upsert({
        where: { id: setting.id },
        update: setting,
        create: setting
      })
    }
    console.log(`✅ ${settings.length} configuraciones migradas`)

    console.log('🎉 ¡Migración completada exitosamente!')
  } catch (error) {
    console.error('❌ Error durante la migración:', error)
  } finally {
    await localPrisma.$disconnect()
    await supabasePrisma.$disconnect()
  }
}

migrateData() 