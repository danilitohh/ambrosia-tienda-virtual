import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimiters } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = rateLimiters.relaxed(req);
    if (rateLimitResult) return rateLimitResult;

    // Cache headers para productos
    const response = NextResponse.json({ products: [] });
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600'); // 5 min cache, 10 min stale

    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        price: true,
        comparePrice: true,
        images: true,
        stock: true,
        category: { select: { name: true } },
        description: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products }, { 
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    console.error("Error obteniendo productos:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
} 