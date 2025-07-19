import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const settings = await prisma.settings.findFirst();
  if (!settings) {
    return NextResponse.json({});
  }
  return NextResponse.json(settings);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  // Valores por defecto para campos requeridos
  const announcement = data.announcement ?? "";
  const announcementImage = data.announcementImage ?? null;
  const nequiNumber = data.nequiNumber ?? "";
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
        bancolombiaQr,
      },
    });
  } else {
    updated = await prisma.settings.create({
      data: {
        announcement,
        announcementImage,
        nequiNumber,
        bancolombiaQr,
      },
    });
  }
  return NextResponse.json(updated);
} 