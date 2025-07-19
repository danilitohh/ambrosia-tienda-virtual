import { prisma } from "../src/lib/prisma";

async function main() {
  console.log('🗑️ Eliminando todas las cuentas de usuario...');
  
  // Eliminar en orden para evitar errores de clave foránea
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.user.deleteMany();
  
  console.log('✅ Todas las cuentas eliminadas exitosamente!');
}

main().catch(e => {
  console.error('❌ Error eliminando cuentas:', e);
  process.exit(1);
}).finally(() => {
  process.exit(0);
}); 