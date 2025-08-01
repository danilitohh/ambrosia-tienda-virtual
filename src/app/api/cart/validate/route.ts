import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { rateLimiters } from "@/lib/rate-limit";

// POST: Validar stock de productos en el carrito
export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = rateLimiters.moderate(req);
    if (rateLimitResult) return rateLimitResult;

    // Permitir validación para usuarios invitados (sin sesión)

    const { items } = await req.json();

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: "Formato de datos inválido" }, 
        { status: 400 }
      );
    }

    const validationResults = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.id },
        select: { id: true, name: true, isActive: true }
      });

      if (!product) {
        validationResults.push({
          id: item.id,
          name: item.name,
          valid: false,
          error: "Producto no encontrado"
        });
        continue;
      }

      if (!product.isActive) {
        validationResults.push({
          id: item.id,
          name: product.name,
          valid: false,
          error: "Producto no disponible"
        });
        continue;
      }

      // Elimina chequeo de stock, ya que el campo fue removido del modelo y la base de datos.
      // Solo valida existencia y estado activo del producto.
      validationResults.push({
        id: item.id,
        name: product.name,
        valid: true
      });
    }

    const hasErrors = validationResults.some(result => !result.valid);

    return NextResponse.json({
      valid: !hasErrors,
      results: validationResults,
      message: hasErrors ? "Algunos productos no están disponibles" : "Todos los productos están disponibles"
    });

  } catch (error) {
    console.error("Error validando carrito:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" }, 
      { status: 500 }
    );
  }
}