import { prisma } from '../src/lib/prisma';

async function optimizeDatabase() {
  try {
    console.log('🔧 Optimizando base de datos...');

    // Verificar conexión
    await prisma.$connect();
    console.log('✅ Conexión a base de datos establecida');

    // Verificar tablas principales
    const tables = ['Product', 'Settings', 'PromoCode', 'User', 'Category'];
    
    for (const table of tables) {
      try {
        const count = await (prisma as any)[table.toLowerCase()].count();
        console.log(`📊 ${table}: ${count} registros`);
      } catch (error) {
        console.log(`⚠️ ${table}: No encontrada o error`);
      }
    }

    // Verificar configuración
    const settings = await prisma.settings.findFirst();
    if (!settings) {
      console.log('⚠️ No hay configuración inicial');
    } else {
      console.log('✅ Configuración encontrada');
    }

    // Verificar productos activos
    const activeProducts = await prisma.product.count({
      where: { isActive: true }
    });
    console.log(`🛍️ Productos activos: ${activeProducts}`);

    // Verificar códigos promocionales activos
    const activePromoCodes = await prisma.promoCode.count({
      where: { isActive: true }
    });
    console.log(`🎫 Códigos promocionales activos: ${activePromoCodes}`);

    // Verificar usuarios
    const userCount = await prisma.user.count();
    console.log(`👥 Usuarios registrados: ${userCount}`);

    console.log('\n🎉 Optimización completada');
    console.log('\n📋 Recomendaciones:');
    console.log('- Considera agregar índices en campos frecuentemente consultados');
    console.log('- Implementa backup automático');
    console.log('- Monitorea el rendimiento de queries');
    console.log('- Considera migrar a PostgreSQL con pooling para mejor rendimiento');

  } catch (error) {
    console.error('❌ Error optimizando base de datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

optimizeDatabase(); 