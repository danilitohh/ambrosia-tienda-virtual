import { prisma } from '../src/lib/prisma';
import { config } from 'dotenv';

// Cargar variables de entorno
config();

async function setupSecurityData() {
  console.log('🔐 Configurando datos de seguridad para usuarios...\n');

  try {
    // 1. Obtener usuarios existentes
    console.log('1. 📋 Obteniendo usuarios existentes...');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        securityQuestion: true,
        securityAnswer: true
      }
    });

    if (users.length === 0) {
      console.log('❌ No hay usuarios en la base de datos');
      return;
    }

    console.log(`✅ Encontrados ${users.length} usuarios:`);
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name || 'Sin nombre'} (${user.email})`);
      console.log(`      📱 Teléfono: ${user.phone || '❌ No configurado'}`);
      console.log(`      ❓ Pregunta: ${user.securityQuestion || '❌ No configurada'}`);
      console.log(`      🔑 Respuesta: ${user.securityAnswer ? '✅ Configurada' : '❌ No configurada'}`);
      console.log('');
    });

    // 2. Configurar datos de seguridad para usuarios sin configuración
    console.log('2. 🔧 Configurando datos de seguridad...');
    
    const usersToUpdate = users.filter(user => 
      !user.phone || !user.securityQuestion || !user.securityAnswer
    );

    if (usersToUpdate.length === 0) {
      console.log('✅ Todos los usuarios ya tienen datos de seguridad configurados');
      return;
    }

    console.log(`📝 Configurando ${usersToUpdate.length} usuarios...`);

    for (const user of usersToUpdate) {
      console.log(`\n👤 Configurando: ${user.name || 'Sin nombre'} (${user.email})`);
      
      // Datos de ejemplo (puedes personalizar)
      const securityData = {
        phone: user.phone || '3001234567', // Teléfono de ejemplo
        securityQuestion: user.securityQuestion || '¿Cuál es el nombre de tu primera mascota?',
        securityAnswer: user.securityAnswer || 'luna' // Respuesta de ejemplo
      };

      try {
        await prisma.user.update({
          where: { id: user.id },
          data: securityData
        });
        
        console.log(`   ✅ Configurado:`);
        console.log(`      📱 Teléfono: ${securityData.phone}`);
        console.log(`      ❓ Pregunta: ${securityData.securityQuestion}`);
        console.log(`      🔑 Respuesta: ${securityData.securityAnswer}`);
        
      } catch (error) {
        console.log(`   ❌ Error configurando usuario: ${error}`);
      }
    }

    // 3. Verificar configuración final
    console.log('\n3. ✅ Verificando configuración final...');
    const updatedUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        securityQuestion: true,
        securityAnswer: true
      }
    });

    console.log('\n📊 Resumen final:');
    updatedUsers.forEach((user, index) => {
      const hasPhone = !!user.phone;
      const hasSecurity = !!user.securityQuestion && !!user.securityAnswer;
      
      console.log(`   ${index + 1}. ${user.name || 'Sin nombre'} (${user.email})`);
      console.log(`      📱 Teléfono: ${hasPhone ? '✅' : '❌'}`);
      console.log(`      🔐 Seguridad: ${hasSecurity ? '✅' : '❌'}`);
    });

    // 4. Instrucciones para el usuario
    console.log('\n4. 💡 Instrucciones para el usuario:');
    console.log('   - Los usuarios pueden cambiar sus datos de seguridad en su perfil');
    console.log('   - Para probar el sistema, usa estos datos:');
    console.log('     Email: admin@ambrosia.com');
    console.log('     Pregunta: ¿Cuál es el nombre de tu primera mascota?');
    console.log('     Respuesta: luna');
    console.log('     Teléfono: 3001234567');
    console.log('     Nueva contraseña: (la que quieras)');

    console.log('\n✅ Configuración completada exitosamente');

  } catch (error) {
    console.error('❌ Error durante la configuración:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupSecurityData(); 