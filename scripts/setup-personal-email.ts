import { config } from 'dotenv';

// Cargar variables de entorno
config();

async function setupPersonalEmail() {
  console.log('📧 Configurando email personal temporal...\n');

  try {
    console.log('1. 🔧 Configuración actual:');
    console.log(`   EMAIL_FROM: ${process.env.EMAIL_FROM}`);
    console.log('');

    console.log('2. 📝 Para usar tu email personal:');
    console.log('   Cambia en tu archivo .env:');
    console.log('   EMAIL_FROM="danilitohhh@gmail.com"');
    console.log('');

    console.log('3. ⚠️  Limitaciones con email personal:');
    console.log('   - Solo podrás enviar emails a tu propia dirección');
    console.log('   - No podrás enviar a otros usuarios');
    console.log('   - Es una solución temporal');
    console.log('');

    console.log('4. ✅ Ventajas:');
    console.log('   - Sistema funcionando inmediatamente');
    console.log('   - Puedes probar la recuperación de contraseña');
    console.log('   - No requiere configuración DNS compleja');
    console.log('');

    console.log('5. 🔄 Después de cambiar .env:');
    console.log('   Ejecuta: npx tsx scripts/verify-domain-config.ts');
    console.log('   Para verificar que funciona');
    console.log('');

    console.log('6. 💡 Alternativas para el futuro:');
    console.log('   - Comprar dominio propio (ej: ambrosia.com)');
    console.log('   - Usar Freenom (dominio gratuito por 12 meses)');
    console.log('   - Configurar DNS en un proveedor que lo permita');
    console.log('');

    console.log('✅ Configuración temporal lista');
    console.log('💡 Cambia EMAIL_FROM en .env y prueba el sistema');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

setupPersonalEmail(); 