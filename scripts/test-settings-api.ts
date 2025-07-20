import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🧪 Probando API de settings...");
  
  try {
    // Probar GET
    console.log("\n1. Probando GET /api/admin/settings...");
    const settings = await prisma.settings.findFirst();
    console.log("✅ GET exitoso:", settings);
    
    // Probar UPDATE
    console.log("\n2. Probando UPDATE...");
    if (settings) {
      const updated = await prisma.settings.update({
        where: { id: settings.id },
        data: {
          announcement: "Test announcement",
          nequiNumber: "3043013144",
          bancolombiaCuenta: "12345678901",
          bancolombiaQr: null,
        },
      });
      console.log("✅ UPDATE exitoso:", updated);
    }
    
    // Probar CREATE si no existe
    console.log("\n3. Probando CREATE...");
    const newSettings = await prisma.settings.upsert({
      where: { id: 1 },
      update: {
        announcement: "Test announcement updated",
        nequiNumber: "3043013144",
        bancolombiaCuenta: "12345678901",
        bancolombiaQr: null,
      },
      create: {
        announcement: "Test announcement",
        nequiNumber: "3043013144",
        bancolombiaCuenta: "12345678901",
        bancolombiaQr: null,
      },
    });
    console.log("✅ UPSERT exitoso:", newSettings);
    
  } catch (error) {
    console.error("❌ Error:", error);
    if (error instanceof Error) {
      console.error("Mensaje:", error.message);
      console.error("Stack:", error.stack);
    }
  }
}

main().catch(e => {
  console.error("Error en main:", e);
  process.exit(1);
}).finally(() => {
  process.exit(0);
}); 