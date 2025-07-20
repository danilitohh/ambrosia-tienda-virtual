import { prisma } from "../src/lib/prisma";
import { authOptions } from "../src/lib/auth";
import { getServerSession } from "next-auth";

async function main() {
  console.log("🔐 Probando sesión de admin...");
  
  try {
    // Verificar usuario admin
    const adminUser = await prisma.user.findUnique({
      where: { email: "admin@ambrosia.com" }
    });
    
    if (!adminUser) {
      console.log("❌ Usuario admin no encontrado");
      return;
    }
    
    console.log("✅ Usuario admin encontrado:");
    console.log("- ID:", adminUser.id);
    console.log("- Email:", adminUser.email);
    console.log("- Rol:", adminUser.role);
    
    // Simular una sesión
    const mockSession = {
      user: {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role
      }
    };
    
    console.log("\n🔍 Verificando autorización...");
    if (mockSession.user.role !== "ADMIN") {
      console.log("❌ Usuario no es admin");
      return;
    }
    
    console.log("✅ Usuario autorizado como admin");
    
    // Probar actualización de settings
    console.log("\n📝 Probando actualización de settings...");
    const updatedSettings = await prisma.settings.update({
      where: { id: 1 },
      data: {
        announcement: "Test desde script",
        nequiNumber: "3043013144",
        bancolombiaCuenta: "12345678901",
        bancolombiaQr: null,
      },
    });
    
    console.log("✅ Settings actualizados exitosamente:", {
      id: updatedSettings.id,
      announcement: updatedSettings.announcement,
      nequiNumber: updatedSettings.nequiNumber,
      bancolombiaCuenta: updatedSettings.bancolombiaCuenta,
    });
    
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