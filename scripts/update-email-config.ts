import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

// Cargar variables de entorno
config();

async function updateEmailConfig() {
  console.log('📧 Actualizando configuración de email...\n');

  try {
    const envPath = path.join(process.cwd(), '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');

    console.log('1. 📋 Configuración actual:');
    console.log(`   EMAIL_FROM: ${process.env.EMAIL_FROM}`);
    console.log(`   RESEND_API_KEY: ${process.env.RESEND_API_KEY ? '✅ Configurado' : '❌ No configurado'}`);

    // Solicitar nuevo dominio
    console.log('\n2. 🌐 Para configurar tu dominio:');
    console.log('   a) Ve a https://resend.com/domains');
    console.log('   b) Haz clic en "Add Domain"');
    console.log('   c) Ingresa tu dominio (ej: ambrosia.com)');
    console.log('   d) Sigue las instrucciones para agregar registros DNS');
    console.log('   e) Espera la verificación (puede tomar hasta 24 horas)');

    console.log('\n3. 📝 Una vez verificado, actualiza tu .env:');
    console.log('   Cambia: EMAIL_FROM="onboarding@resend.dev"');
    console.log('   Por:    EMAIL_FROM="noreply@tudominio.com"');

    // Mostrar ejemplo de configuración
    console.log('\n4. 💡 Ejemplo de configuración final:');
    console.log('   # Para desarrollo:');
    console.log('   EMAIL_FROM="onboarding@resend.dev"');
    console.log('   ');
    console.log('   # Para producción (después de verificar dominio):');
    console.log('   EMAIL_FROM="noreply@ambrosia.com"');
    console.log('   # o');
    console.log('   EMAIL_FROM="contact@ambrosia.com"');
    console.log('   # o');
    console.log('   EMAIL_FROM="mail@ambrosia.com"');

    console.log('\n5. 🔧 Scripts disponibles:');
    console.log('   npx tsx scripts/verify-domain-config.ts    # Verificar configuración');
    console.log('   npx tsx scripts/test-password-recovery.ts  # Probar recuperación');
    console.log('   npx tsx scripts/test-email-detailed.ts     # Probar envío de email');

    console.log('\n✅ Guía completada');
    console.log('💡 Una vez que tengas tu dominio verificado, ejecuta:');
    console.log('   npx tsx scripts/verify-domain-config.ts');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

updateEmailConfig(); 