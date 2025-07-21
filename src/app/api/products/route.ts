import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
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
    // Logging detallado
    if (error instanceof Error) {
      console.error("[API PRODUCTS ERROR]", error.message, error.stack);
    } else {
      console.error("[API PRODUCTS ERROR]", error);
    }
    return NextResponse.json({ error: "Error interno del servidor", details: String(error) }, { status: 500 });
  }
} 