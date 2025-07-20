import { Resend } from 'resend';
import { config } from 'dotenv';

// Cargar variables de entorno
config();

async function verifyDomainConfig() {
  console.log('🔍 Verificando configuración de dominio en Resend...\n');

  try {
    // 1. Verificar API Key
    console.log('1. 🔑 Verificando API Key de Resend...');
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (!resendApiKey) {
      console.log('❌ RESEND_API_KEY no está configurado');
      console.log('💡 Ve a https://resend.com/api-keys para obtener tu API key');
      return;
    }
    
    console.log('✅ RESEND_API_KEY configurado');
    console.log(`   Key: ${resendApiKey.substring(0, 10)}...`);

    // 2. Verificar EMAIL_FROM
    console.log('\n2. 📧 Verificando EMAIL_FROM...');
    const emailFrom = process.env.EMAIL_FROM;
    
    if (!emailFrom) {
      console.log('❌ EMAIL_FROM no está configurado');
      return;
    }
    
    console.log(`✅ EMAIL_FROM configurado: ${emailFrom}`);
    
    // 3. Verificar tipo de dominio
    console.log('\n3. 🌐 Analizando tipo de dominio...');
    if (emailFrom.includes('@resend.dev')) {
      console.log('⚠️  Usando dominio de prueba (resend.dev)');
      console.log('💡 Solo puedes enviar emails a tu propia dirección');
      console.log('💡 Para enviar a cualquier email, verifica tu dominio en https://resend.com/domains');
    } else if (emailFrom.includes('@gmail.com') || emailFrom.includes('@yahoo.com') || emailFrom.includes('@hotmail.com')) {
      console.log('⚠️  Usando proveedor de email personal');
      console.log('💡 Considera usar un dominio verificado para mejor entregabilidad');
    } else {
      console.log('✅ Usando dominio personalizado');
      console.log('💡 Verifica que el dominio esté verificado en Resend');
    }

    // 4. Probar conexión con Resend
    console.log('\n4. 🔌 Probando conexión con Resend...');
    const resend = new Resend(resendApiKey);
    
    try {
      // Intentar obtener dominios (esto requiere permisos de lectura)
      await resend.domains.list();
      console.log('✅ Conexión con Resend exitosa');
      console.log('📋 Tienes permisos para gestionar dominios');
    } catch (error: any) {
      if (error.statusCode === 403) {
        console.log('⚠️  API Key no tiene permisos para listar dominios');
        console.log('💡 Esto es normal, solo necesitas permisos de envío');
      } else {
        console.log('❌ Error conectando con Resend:', error.message);
      }
    }

    // 5. Probar envío de email de prueba
    console.log('\n5. 📤 Probando envío de email...');
    const testEmail = process.env.TEST_EMAIL || 'tu-email@gmail.com';
    
    if (testEmail === 'tu-email@gmail.com') {
      console.log('⚠️  TEST_EMAIL no configurado, usando placeholder');
      console.log('💡 Configura TEST_EMAIL en .env para probar envío real');
    } else {
      try {
        const result = await resend.emails.send({
          from: emailFrom,
          to: [testEmail],
          subject: '🧪 Prueba de dominio - Ambrosia',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #333;">🧪 Prueba de Dominio</h1>
              <p>Este es un email de prueba para verificar que tu dominio está configurado correctamente en Resend.</p>
              <p><strong>Dominio remitente:</strong> ${emailFrom}</p>
              <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
              <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin-top: 20px;">
                <p style="margin: 0; color: #666;">Si recibes este email, tu configuración está funcionando correctamente.</p>
              </div>
            </div>
          `,
        });
        
        console.log('✅ Email de prueba enviado exitosamente');
        console.log(`   ID: ${result.data?.id}`);
        console.log(`   A: ${testEmail}`);
      } catch (error: any) {
        console.log('❌ Error enviando email de prueba:', error.message);
        
        if (error.message.includes('domain')) {
          console.log('💡 El dominio no está verificado. Ve a https://resend.com/domains');
        }
      }
    }

    // 6. Recomendaciones
    console.log('\n6. 💡 Recomendaciones:');
    
    if (emailFrom.includes('@resend.dev')) {
      console.log('   🔄 Para producción, verifica tu dominio en https://resend.com/domains');
      console.log('   📝 Cambia EMAIL_FROM a tu dominio verificado');
    }
    
    console.log('   🔒 Asegúrate de que tu API key tenga permisos de envío');
    console.log('   📧 Configura TEST_EMAIL en .env para pruebas');
    console.log('   🌐 Considera usar un dominio personalizado para mejor entregabilidad');

    console.log('\n✅ Verificación completada');

  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  }
}

verifyDomainConfig(); 