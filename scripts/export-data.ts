import { PrismaClient } from '../src/generated/prisma'

const localPrisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://daniloherrera@localhost:5432/ambrosia'
    }
  }
})

async function exportData() {
  try {
    console.log('📤 Exportando datos de la base de datos local...')

    // Exportar categorías
    console.log('📂 Exportando categorías...')
    const categories = await localPrisma.category.findMany()
    console.log('\n-- Categorías')
    for (const category of categories) {
      console.log(`INSERT INTO "Category" ("id", "name", "description", "image", "slug", "createdAt", "updatedAt") VALUES ('${category.id}', '${category.name.replace(/'/g, "''")}', ${category.description ? `'${category.description.replace(/'/g, "''")}'` : 'NULL'}, ${category.image ? `'${category.image}'` : 'NULL'}, '${category.slug}', '${category.createdAt.toISOString()}', '${category.updatedAt.toISOString()}');`)
    }

    // Exportar productos
    console.log('\n-- Productos')
    const products = await localPrisma.product.findMany()
    for (const product of products) {
      const imagesArray = product.images ? `ARRAY[${product.images.map(img => `'${img}'`).join(', ')}]` : 'ARRAY[]::text[]'
      console.log(`INSERT INTO "Product" ("id", "name", "description", "price", "comparePrice", "images", "sku", "stock", "isActive", "isFeatured", "slug", "weight", "dimensions", "categoryId", "createdAt", "updatedAt") VALUES ('${product.id}', '${product.name.replace(/'/g, "''")}', '${product.description.replace(/'/g, "''")}', ${product.price}, ${product.comparePrice || 'NULL'}, ${imagesArray}, '${product.sku}', ${product.stock}, ${product.isActive}, ${product.isFeatured}, '${product.slug}', ${product.weight || 'NULL'}, ${product.dimensions ? `'${product.dimensions}'` : 'NULL'}, '${product.categoryId}', '${product.createdAt.toISOString()}', '${product.updatedAt.toISOString()}');`)
    }

    // Exportar configuraciones
    console.log('\n-- Configuraciones')
    const settings = await localPrisma.settings.findMany()
    for (const setting of settings) {
      console.log(`INSERT INTO "Settings" ("id", "announcement", "announcementImage", "nequiNumber", "bancolombiaCuenta", "bancolombiaQr", "updatedAt") VALUES (${setting.id}, '${setting.announcement.replace(/'/g, "''")}', ${setting.announcementImage ? `'${setting.announcementImage}'` : 'NULL'}, '${setting.nequiNumber}', '${setting.bancolombiaCuenta}', ${setting.bancolombiaQr ? `'${setting.bancolombiaQr}'` : 'NULL'}, '${setting.updatedAt.toISOString()}');`)
    }

    console.log('\n✅ Exportación completada. Copia y pega las líneas INSERT en el SQL Editor de Supabase.')
  } catch (error) {
    console.error('❌ Error durante la exportación:', error)
  } finally {
    await localPrisma.$disconnect()
  }
}

exportData() 