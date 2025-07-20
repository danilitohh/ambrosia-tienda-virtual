import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const email = "admin@ambrosia.com";
  const password = "admin123";
  
  console.log("🔐 Probando login del admin...");
  
  const user = await prisma.user.findUnique({
    where: { email }
  });
  
  if (!user) {
    console.log("❌ Usuario no encontrado");
    return;
  }
  
  console.log("✅ Usuario encontrado:");
  console.log("- ID:", user.id);
  console.log("- Email:", user.email);
  console.log("- Rol:", user.role);
  console.log("- Tiene contraseña:", !!user.password);
  
  if (user.password) {
    const isValid = await bcrypt.compare(password, user.password);
    console.log("- Contraseña válida:", isValid);
  } else {
    console.log("❌ Usuario no tiene contraseña");
  }
}

main().catch(e => {
  console.error("Error:", e);
  process.exit(1);
}).finally(() => {
  process.exit(0);
}); 