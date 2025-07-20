import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCachedOrFetch, cacheKeys } from "@/lib/cache";

export async function GET() {
  try {
    const settings = await getCachedOrFetch(
      cacheKeys.settings,
      async () => {
        return await prisma.settings.findFirst();
      },
      300 // 5 minutos de caché
    );
    
    return NextResponse.json(settings || {}, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    console.error("Error obteniendo configuración:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
        const data = await req.json();
    // Valores por defecto para campos requeridos
  const announcement = data.announcement ?? "";
  const announcementImage = data.announcementImage ?? null;
  const nequiNumber = data.nequiNumber ?? "";
  const bancolombiaCuenta = data.bancolombiaCuenta ?? "12345678901";
  const bancolombiaQr = data.bancolombiaQr ?? null;
  const settings = await prisma.settings.findFirst();
  let updated;
  if (settings) {
    updated = await prisma.settings.update({
      where: { id: settings.id },
      data: {
        announcement,
        announcementImage,
        nequiNumber,
        bancolombiaCuenta,
        bancolombiaQr,
      },
    });
  } else {
    updated = await prisma.settings.create({
      data: {
        announcement,
        announcementImage,
        nequiNumber,
        bancolombiaCuenta,
        bancolombiaQr,
      },
    });
  }
  return NextResponse.json(updated);
  } catch (error) {
    console.error("Error en POST /api/admin/settings:", error);
    console.error("Stack trace:", error instanceof Error ? error.stack : "No stack trace");
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
} 