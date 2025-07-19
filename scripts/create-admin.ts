import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const email = "admin@ambrosia.com";
  const password = "admin123";
  const name = "Administrador Ambrosia";
  
  console.log('👤 Creando usuario administrador...');
  
  // Verificar si ya existe
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });
  
  if (existingUser) {
    console.log('⚠️ El usuario admin ya existe. Actualizando rol...');
    await prisma.user.update({
      where: { email },
      data: { role: "ADMIN" }
    });
    console.log('✅ Usuario admin actualizado exitosamente!');
  } else {
    // Crear nuevo usuario admin
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: "ADMIN",
        emailVerified: new Date()
      }
    });
    
    console.log('✅ Usuario administrador creado exitosamente!');
  }
  
  console.log('📧 Email:', email);
  console.log('🔑 Contraseña:', password);
  console.log('🔗 Puedes acceder al panel admin en: /admin');
}

main().catch(e => {
  console.error('❌ Error creando admin:', e);
  process.exit(1);
}).finally(() => {
  process.exit(0);
}); 