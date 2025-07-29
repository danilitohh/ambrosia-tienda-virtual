import { prisma } from '../src/lib/prisma';

async function testPasswordRecovery() {
  console.log('🧪 Probando sistema de recuperación de contraseña...\n');

  try {
    // 1. Verificar usuarios existentes
    console.log('1. 📋 Verificando usuarios en la base de datos...');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    });

    if (users.length === 0) {
      console.log('❌ No hay usuarios en la base de datos');
      return;
    }

    console.log(`✅ Encontrados ${users.length} usuarios:`);
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name || 'Sin nombre'} (${user.email}) - ID: ${user.id}`);
    });

    // 2. Verificar tokens de recuperación existentes (omitido: modelo passwordResetToken no existe)
    // console.log('\n2. 🔑 Verificando tokens de recuperación existentes...');
    // const existingTokens = await prisma.passwordResetToken.findMany({
    //   include: {
    //     user: {
    //       select: {
    //         email: true,
    //         name: true
    //       }
    //     }
    //   }
    // });
    // if (existingTokens.length > 0) {
    //   console.log(`⚠️  Encontrados ${existingTokens.length} tokens de recuperación:`);
    //   existingTokens.forEach((token, index) => {
    //     const isExpired = token.expires < new Date();
    //     console.log(`   ${index + 1}. Usuario: ${token.user.name || 'Sin nombre'} (${token.user.email})`);
    //     console.log(`      Token: ${token.token.substring(0, 20)}...`);
    //     console.log(`      Expira: ${token.expires.toLocaleString()} ${isExpired ? '❌ EXPIRADO' : '✅ VÁLIDO'}`);
    //   });
    // } else {
    //   console.log('✅ No hay tokens de recuperación activos');
    // }

    // 3. Probar búsqueda de usuario por email
    console.log('\n3. 🔍 Probando búsqueda de usuario por email...');
    const testEmail = users[0].email;
    console.log(`   Probando con email: ${testEmail}`);

    const foundUser = await prisma.user.findFirst({
      where: {
        email: {
          equals: testEmail,
          mode: 'insensitive'
        }
      }
    });

    if (foundUser) {
      console.log(`✅ Usuario encontrado: ${foundUser.name || 'Sin nombre'} (${foundUser.email})`);
    } else {
      console.log('❌ Usuario no encontrado');
    }

    // 4. Verificar configuración de email
    console.log('\n4. 📧 Verificando configuración de email...');
    const emailConfig = {
      RESEND_API_KEY: process.env.RESEND_API_KEY ? '✅ Configurado' : '❌ No configurado',
      EMAIL_FROM: process.env.EMAIL_FROM ? '✅ Configurado' : '❌ No configurado',
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ? '✅ Configurado' : '❌ No configurado'
    };

    Object.entries(emailConfig).forEach(([key, status]) => {
      console.log(`   ${key}: ${status}`);
    });

    // 5. Recomendaciones
    console.log('\n5. 💡 Recomendaciones:');
    
    if (users.some(u => !u.email || u.email.trim() === '')) {
      console.log('   ⚠️  Algunos usuarios no tienen email configurado');
      console.log('   💡 Considera actualizar estos usuarios con emails válidos');
    }

    if (!process.env.RESEND_API_KEY) {
      console.log('   ⚠️  RESEND_API_KEY no está configurado');
      console.log('   💡 Configura la variable de entorno para enviar emails');
    }

    if (!process.env.EMAIL_FROM) {
      console.log('   ⚠️  EMAIL_FROM no está configurado');
      console.log('   💡 Configura el email remitente en las variables de entorno');
    }

    console.log('\n✅ Prueba completada exitosamente');

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPasswordRecovery(); 