import { config } from 'dotenv';

// Cargar variables de entorno
config();

async function setupInfinityFreeDomain() {
  console.log('🆓 Configurando ambrosia.infinityfree.com en Resend...\n');

  try {
    console.log('1. 📋 Pasos para obtener subdominio en InfinityFree:\n');

    console.log('   a) Ve a https://infinityfree.net/');
    console.log('   b) Haz clic en "Get Started Free"');
    console.log('   c) Regístrate con tu email');
    console.log('   d) Confirma tu cuenta por email');
    console.log('   e) Ve a "Control Panel"');
    console.log('   f) Haz clic en "Subdomains"');
    console.log('   g) Crea: ambrosia.infinityfree.com');
    console.log('');

    console.log('2. 🔧 Configurar en Resend:\n');

    console.log('   a) Ve a https://resend.com/domains');
    console.log('   b) Haz clic en "Add Domain"');
    console.log('   c) Dominio: infinityfree.com');
    console.log('   d) Región: São Paulo (sa-east-1)');
    console.log('   e) Haz clic en "Add Domain"');
    console.log('');

    console.log('3. 📝 Configurar DNS en InfinityFree:\n');

    console.log('   a) Ve a tu Control Panel de InfinityFree');
    console.log('   b) Ve a "DNS Manager" o "Zone Editor"');
    console.log('   c) Agrega los registros que te dé Resend:');
    console.log('');
    console.log('   Registros típicos de Resend:');
    console.log('   - Tipo: MX, Nombre: send, Valor: feedback-smtp.sa-east-...');
    console.log('   - Tipo: TXT, Nombre: send, Valor: v=spf1 include:amazons...');
    console.log('   - Tipo: TXT, Nombre: resend._domainkey, Valor: p=MIGfMAOGCSqGSIb3DQEB...');
    console.log('   - Tipo: TXT, Nombre: _dmarc, Valor: v=DMARC1; p=none;');
    console.log('');

    console.log('4. 📧 Configuración final en .env:\n');

    console.log('   Después de verificar el dominio, cambia en .env:');
    console.log('   EMAIL_FROM="noreply@infinityfree.com"');
    console.log('   # o');
    console.log('   EMAIL_FROM="contact@infinityfree.com"');
    console.log('   # o');
    console.log('   EMAIL_FROM="mail@infinityfree.com"');
    console.log('');

    console.log('5. ⚠️  Consideraciones importantes:\n');

    console.log('   ✅ Ventajas:');
    console.log('   - Completamente gratis');
    console.log('   - Sin límites de tiempo');
    console.log('   - Fácil de configurar');
    console.log('');
    console.log('   ⚠️  Limitaciones:');
    console.log('   - Subdominio (no dominio propio)');
    console.log('   - Puede tener restricciones de DNS');
    console.log('   - Menos profesional que dominio propio');
    console.log('');

    console.log('6. 🔍 Verificación:\n');

    console.log('   Después de configurar, ejecuta:');
    console.log('   npx tsx scripts/verify-domain-config.ts');
    console.log('');

    console.log('✅ Guía completada');
    console.log('💡 ¿Necesitas ayuda con algún paso específico?');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

setupInfinityFreeDomain(); 