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
      url: 'postgresql://postgres:Tr3scorazon!@db.fmdnopkzeisopsohrzrq.supabase.co:5432/postgres'
    }
  }
})

async function migrateData() {
  try {
    console.log('🚀 Iniciando migración de datos con conexión directa...')

    // Migrar categorías
    console.log('📂 Migrando categorías...')
    const categories = await localPrisma.category.findMany()
    console.log(`Encontradas ${categories.length} categorías`)
    
    for (const category of categories) {
      try {
        await supabasePrisma.category.upsert({
          where: { id: category.id },
          update: category,
          create: category
        })
        console.log(`✅ Categoría migrada: ${category.name}`)
      } catch (error) {
        if (error instanceof Error) {
          console.log(`⚠️ Error migrando categoría ${category.name}:`, error.message)
        } else {
          console.log(`⚠️ Error migrando categoría ${category.name}:`, error)
        }
      }
    }

    // Migrar productos
    console.log('📦 Migrando productos...')
    const products = await localPrisma.product.findMany()
    console.log(`Encontrados ${products.length} productos`)
    
    for (const product of products) {
      try {
        await supabasePrisma.product.upsert({
          where: { id: product.id },
          update: product,
          create: product
        })
        console.log(`✅ Producto migrado: ${product.name}`)
      } catch (error) {
        if (error instanceof Error) {
          console.log(`⚠️ Error migrando producto ${product.name}:`, error.message)
        } else {
          console.log(`⚠️ Error migrando producto ${product.name}:`, error)
        }
      }
    }

    // Migrar configuraciones
    console.log('⚙️ Migrando configuraciones...')
    const settings = await localPrisma.settings.findMany()
    console.log(`Encontradas ${settings.length} configuraciones`)
    
    for (const setting of settings) {
      try {
        await supabasePrisma.settings.upsert({
          where: { id: setting.id },
          update: setting,
          create: setting
        })
        console.log(`✅ Configuración migrada: ID ${setting.id}`)
      } catch (error) {
        if (error instanceof Error) {
          console.log(`⚠️ Error migrando configuración ID ${setting.id}:`, error.message)
        } else {
          console.log(`⚠️ Error migrando configuración ID ${setting.id}:`, error)
        }
      }
    }

    console.log('🎉 ¡Migración completada!')
  } catch (error) {
    console.error('❌ Error durante la migración:', error)
  } finally {
    await localPrisma.$disconnect()
    await supabasePrisma.$disconnect()
  }
}

migrateData() 