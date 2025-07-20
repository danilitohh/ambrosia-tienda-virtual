import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const email = process.argv[2] || "admin@ambrosia.com";
  const password = process.argv[3] || "admin123";
  
  const hashedPassword = await bcrypt.hash(password, 12);
  
  const user = await prisma.user.update({
    where: { email },
    data: { 
      role: "ADMIN",
      password: hashedPassword
    },
  });
  console.log(`Usuario ${email} ahora es ADMIN con contraseña: ${password}`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => {
  process.exit(0);
}); 