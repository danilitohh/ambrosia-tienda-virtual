import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

// Cargar variables de entorno
config();

async function setupFreeEmail() {
  console.log('🆓 Configurando email gratuito...\n');

  try {
    console.log('1. 📧 Opciones gratuitas disponibles:\n');

    console.log('   A) Dominio gratuito (.tk, .ml, .ga, .cf, .gq):');
    console.log('      💰 Gratis por 12 meses');
    console.log('      🔗 https://www.freenom.com/');
    console.log('      📝 Ejemplo: ambrosia.tk, ambrosia.ml');
    console.log('');

    console.log('   B) Subdominio gratuito:');
    console.log('      💰 Completamente gratis');
    console.log('      🔗 https://infinityfree.net/');
    console.log('      📝 Ejemplo: ambrosia.infinityfree.com');
    console.log('');

    console.log('   C) Email personal (solución temporal):');
    console.log('      💰 Gratis');
    console.log('      📧 Usar tu email personal como remitente');
    console.log('      ⚠️  Limitaciones de envío');
    console.log('');

    console.log('2. 🎯 Recomendación:');
    console.log('   ✅ Opción A: Dominio gratuito en Freenom');
    console.log('   💡 Puedes obtener ambrosia.tk gratis por 12 meses');
    console.log('');

    console.log('3. 📋 Pasos para dominio gratuito:');
    console.log('   a) Ve a https://www.freenom.com/');
    console.log('   b) Busca "ambrosia"');
    console.log('   c) Selecciona .tk, .ml, .ga, .cf, o .gq');
    console.log('   d) Regístrate (gratis)');
    console.log('   e) Configura DNS en Freenom');
    console.log('   f) Agrega registros en Resend');
    console.log('');

    console.log('4. 🔧 Configuración actual:');
    const currentEmail = process.env.EMAIL_FROM;
    console.log(`   EMAIL_FROM actual: ${currentEmail}`);
    console.log('');

    console.log('5. 📝 Después de obtener dominio gratuito:');
    console.log('   Cambia en .env:');
    console.log('   EMAIL_FROM="noreply@ambrosia.tk"');
    console.log('   # o');
    console.log('   EMAIL_FROM="contact@ambrosia.ml"');
    console.log('');

    console.log('6. ⚡ Alternativa rápida (email personal):');
    console.log('   Si quieres probar ahora mismo:');
    console.log('   EMAIL_FROM="tu-email@gmail.com"');
    console.log('   ⚠️  Solo podrás enviar a tu propia dirección');
    console.log('');

    console.log('✅ Guía completada');
    console.log('💡 ¿Quieres que te ayude con alguna opción específica?');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

setupFreeEmail(); 