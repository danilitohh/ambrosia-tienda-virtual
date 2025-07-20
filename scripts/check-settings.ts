import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🔍 Verificando configuración de la base de datos...");
  
  const settings = await prisma.settings.findFirst();
  
  if (settings) {
    console.log("✅ Configuración encontrada:");
    console.log("- ID:", settings.id);
    console.log("- Anuncio:", settings.announcement);
    console.log("- Número Nequi:", settings.nequiNumber);
    console.log("- Cuenta Bancolombia:", settings.bancolombiaCuenta);
    console.log("- QR Bancolombia:", settings.bancolombiaQr ? "Sí" : "No");
    console.log("- Actualizado:", settings.updatedAt);
  } else {
    console.log("❌ No hay configuración en la base de datos");
  }
}

main().catch(e => {
  console.error("Error:", e);
  process.exit(1);
}).finally(() => {
  process.exit(0);
}); 