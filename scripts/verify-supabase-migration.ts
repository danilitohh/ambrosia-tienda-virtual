import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function verifyMigration() {
  try {
    console.log('🔍 Verificando migración a Supabase...\n')

    // Verificar conexión
    console.log('1. Probando conexión...')
    await prisma.$connect()
    console.log('✅ Conexión exitosa\n')

    // Verificar categorías
    console.log('2. Verificando categorías...')
    const categories = await prisma.category.findMany()
    console.log(`✅ Encontradas ${categories.length} categorías:`)
    categories.forEach(cat => console.log(`   - ${cat.name}`))
    console.log()

    // Verificar productos
    console.log('3. Verificando productos...')
    const products = await prisma.product.findMany({
      include: {
        category: true
      }
    })
    console.log(`✅ Encontrados ${products.length} productos:`)
    products.forEach(prod => console.log(`   - ${prod.name} (${prod.category?.name}) - $${prod.price}`))
    console.log()

    // Verificar configuración
    console.log('4. Verificando configuración...')
    const settings = await prisma.settings.findFirst()
    if (settings) {
      console.log('✅ Configuración encontrada')
      console.log(`   - Anuncio: ${settings.announcement || 'No configurado'}`)
      console.log(`   - Nequi: ${settings.nequiNumber || 'No configurado'}`)
      console.log(`   - Bancolombia: ${settings.bancolombiaCuenta || 'No configurado'}`)
    } else {
      console.log('⚠️  No se encontró configuración')
    }
    console.log()

    // Verificar usuarios (solo contar)
    console.log('5. Verificando usuarios...')
    const userCount = await prisma.user.count()
    console.log(`✅ Encontrados ${userCount} usuarios`)
    console.log()

    console.log('🎉 ¡Migración verificada exitosamente!')
    console.log('📊 Resumen:')
    console.log(`   - Categorías: ${categories.length}`)
    console.log(`   - Productos: ${products.length}`)
    console.log(`   - Usuarios: ${userCount}`)
    console.log(`   - Configuración: ${settings ? 'Sí' : 'No'}`)

  } catch (error) {
    console.error('❌ Error durante la verificación:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verifyMigration() 