import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe no está configurado" }, { status: 500 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }
  // El modelo cartItem no existe, por lo tanto no se puede procesar el checkout
  // Si deseas implementar esta funcionalidad, primero crea el modelo cartItem en tu esquema de Prisma y ejecuta una migración.
  return NextResponse.json({ 
    error: "Funcionalidad no disponible: el modelo cartItem no existe en la base de datos." 
  }, { status: 501 });
} 