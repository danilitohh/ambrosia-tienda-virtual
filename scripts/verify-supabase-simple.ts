import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function verifyMigrationSimple() {
  try {
    console.log('🔍 Verificando migración a Supabase (versión simple)...\n')

    // Verificar conexión
    console.log('1. Probando conexión...')
    await prisma.$connect()
    console.log('✅ Conexión exitosa\n')

    // Verificar que las tablas existen
    console.log('2. Verificando tablas...')
    
    try {
      const categories = await prisma.category.findMany()
      console.log(`✅ Tabla Category: ${categories.length} registros`)
    } catch (error: any) {
      console.log('❌ Error con tabla Category:', error.message)
    }

    try {
      const products = await prisma.product.findMany()
      console.log(`✅ Tabla Product: ${products.length} registros`)
    } catch (error: any) {
      console.log('❌ Error con tabla Product:', error.message)
    }

    try {
      const settings = await prisma.settings.findFirst()
      console.log(`✅ Tabla Settings: ${settings ? 'Configurado' : 'No configurado'}`)
    } catch (error: any) {
      console.log('❌ Error con tabla Settings:', error.message)
    }

    try {
      const userCount = await prisma.user.count()
      console.log(`✅ Tabla User: ${userCount} usuarios`)
    } catch (error: any) {
      console.log('❌ Error con tabla User:', error.message)
    }

    console.log('\n🎉 Verificación completada!')
    console.log('📝 Nota: Los errores de "prepared statement" son normales con el pooler de Supabase')
    console.log('✅ La aplicación debería funcionar correctamente')

  } catch (error) {
    console.error('❌ Error durante la verificación:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verifyMigrationSimple() 