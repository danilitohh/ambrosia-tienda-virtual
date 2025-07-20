import { prisma } from '../src/lib/prisma';
import { sendEmail } from '../src/lib/email';

async function testPasswordRecoveryEmail() {
  console.log('🧪 Probando envío de email de recuperación de contraseña...\n');

  try {
    // 1. Obtener usuarios con email válido
    console.log('1. 📋 Buscando usuarios con email válido...');
    const users = await prisma.user.findMany({
      where: {
        email: {
          not: ''
        }
      },
      select: {
        id: true,
        email: true,
        name: true
      }
    });

    if (users.length === 0) {
      console.log('❌ No hay usuarios con email válido');
      return;
    }

    console.log(`✅ Encontrados ${users.length} usuarios con email válido:`);
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name || 'Sin nombre'} (${user.email})`);
    });

    // 2. Seleccionar usuario para prueba
    const testUser = users[0];
    console.log(`\n2. 🎯 Usuario seleccionado para prueba: ${testUser.name || 'Sin nombre'} (${testUser.email})`);

    // 3. Generar token de prueba
    console.log('\n3. 🔑 Generando token de prueba...');
    const crypto = require('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    console.log(`   Token: ${token.substring(0, 20)}...`);
    console.log(`   Expira: ${expires.toLocaleString()}`);

    // 4. Eliminar tokens previos del usuario
    console.log('\n4. 🗑️ Eliminando tokens previos...');
    await prisma.passwordResetToken.deleteMany({
      where: { userId: testUser.id }
    });
    console.log('   ✅ Tokens previos eliminados');

    // 5. Guardar nuevo token
    console.log('\n5. 💾 Guardando token en base de datos...');
    await prisma.passwordResetToken.create({
      data: {
        userId: testUser.id,
        token,
        expires,
      },
    });
    console.log('   ✅ Token guardado exitosamente');

    // 6. Construir enlace
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3004';
    const link = `${baseUrl}/auth/reset-password/${token}`;
    console.log(`\n6. 🔗 Enlace generado: ${link}`);

    // 7. Enviar email
    console.log('\n7. 📧 Enviando email de recuperación...');
    const emailResult = await sendEmail({
      to: testUser.email,
      subject: '🧪 PRUEBA - Recupera tu contraseña - Ambrosia',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #333; text-align: center; margin-bottom: 30px;">🧪 PRUEBA - Recupera tu contraseña</h1>
            
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <p style="color: #856404; margin: 0; font-weight: bold;">⚠️ ESTE ES UN EMAIL DE PRUEBA</p>
            </div>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Hola <strong>${testUser.name || 'Usuario'}</strong>, este es un email de prueba para verificar que el sistema de recuperación de contraseña funciona correctamente.
            </p>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              Haz clic en el botón de abajo para probar el enlace de recuperación:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${link}" style="background-color: #C6FF00; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px;">
                🧪 Probar Recuperación
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
              Si el botón no funciona, copia y pega este enlace en tu navegador:
            </p>
            
            <p style="color: #007bff; font-size: 14px; word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 5px; margin-bottom: 30px;">
              ${link}
            </p>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
              <p style="color: #888; font-size: 12px; margin-bottom: 10px;">
                ⏰ Este enlace expirará en 1 hora por seguridad.
              </p>
              <p style="color: #888; font-size: 12px; margin-bottom: 10px;">
                🧪 Este es un email de prueba del sistema de recuperación.
              </p>
              <p style="color: #888; font-size: 12px;">
                📧 Si tienes problemas, contacta a nuestro equipo de soporte.
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #888; font-size: 12px;">
            <p>© 2024 Ambrosia. Todos los derechos reservados.</p>
          </div>
        </div>
      `,
    });

    console.log('   📧 Resultado del envío:', emailResult);

    if (emailResult.success) {
      console.log('   ✅ Email enviado exitosamente');
      console.log(`   📬 Email enviado a: ${testUser.email}`);
    } else {
      console.log('   ❌ Error enviando email:', emailResult.error);
    }

    // 8. Verificar token en base de datos
    console.log('\n8. 🔍 Verificando token en base de datos...');
    const savedToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            email: true,
            name: true
          }
        }
      }
    });

    if (savedToken) {
      console.log('   ✅ Token encontrado en base de datos');
      console.log(`   👤 Usuario: ${savedToken.user.name || 'Sin nombre'} (${savedToken.user.email})`);
      console.log(`   ⏰ Expira: ${savedToken.expires.toLocaleString()}`);
    } else {
      console.log('   ❌ Token no encontrado en base de datos');
    }

    console.log('\n✅ Prueba de email de recuperación completada exitosamente');

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPasswordRecoveryEmail(); 