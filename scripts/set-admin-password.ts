import { prisma } from "../src/lib/prisma";

async function main() {
  const email = process.argv[2] || "danilitohhh@gmail.com";
  const user = await prisma.user.update({
    where: { email },
    data: { role: "ADMIN" },
  });
  console.log(`Usuario ${email} ahora es ADMIN.`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => {
  process.exit(0);
}); 