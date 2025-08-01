import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET: Obtener el carrito del usuario autenticado
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ items: [] });
    }

    const user = await prisma.user.findUnique({ 
      where: { email: session.user.email } 
    });
    
    if (!user) {
      return NextResponse.json({ items: [] });
    }

    // El modelo cartItem no existe, devolvemos carrito vacío
    // const cartItems = await prisma.cartItem.findMany({
    //   where: { userId: user.id },
    //   include: { 
    //     product: {
    //       select: {
    //         id: true,
    //         name: true,
    //         price: true,
    //         images: true
    //       }
    //     } 
    //   },
    //   orderBy: { createdAt: 'desc' }
    // });
    // const items = cartItems.map((item) => ({
    //   id: item.productId,
    //   name: item.product.name,
    //   price: Number(item.product.price),
    //   quantity: item.quantity,
    //   image: item.product.images[0] || null
    // }));
    return NextResponse.json({ items: [] });
  } catch (error) {
    console.error("Error obteniendo carrito:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" }, 
      { status: 500 }
    );
  }
}

// POST: Actualizar el carrito del usuario autenticado
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "No autenticado" }, 
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({ 
      where: { email: session.user.email } 
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" }, 
        { status: 404 }
      );
    }

    const { items } = await req.json();

    // Log para depuración
    console.log("[CART API] Items recibidos:", JSON.stringify(items, null, 2));

    // Validar que items sea un array
    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: "Formato de datos inválido" }, 
        { status: 400 }
      );
    }

    // Validar cada item
    for (const item of items) {
      if (!item.id || !item.name || typeof item.price !== 'number' || typeof item.quantity !== 'number') {
        console.error("[CART API] Datos de producto inválidos:", item);
        return NextResponse.json(
          { error: "Datos de producto inválidos" }, 
          { status: 400 }
        );
      }

      if (item.quantity < 1) {
        console.error("[CART API] Cantidad debe ser mayor a 0:", item);
        return NextResponse.json(
          { error: "Cantidad debe ser mayor a 0" }, 
          { status: 400 }
        );
      }

      // Verificar que el producto exista antes de crear el cartItem
      const productExists = await prisma.product.findUnique({ where: { id: item.id } });
      if (!productExists) {
        console.error(`[CART API] El producto con id ${item.id} no existe`);
        return NextResponse.json(
          { error: `El producto con id ${item.id} no existe` },
          { status: 400 }
        );
      }
    }

    // El modelo cartItem no existe, por lo tanto no se puede actualizar el carrito
    // Si deseas implementar esta funcionalidad, primero crea el modelo cartItem en tu esquema de Prisma y ejecuta una migración.
    return NextResponse.json({ 
      error: "Funcionalidad no disponible: el modelo cartItem no existe en la base de datos." 
    }, { status: 501 });
  } catch (error) {
    console.error("Error actualizando carrito:", error);
    // Manejo seguro del error de clave foránea
    type PrismaError = { code: string };
    if (typeof error === 'object' && error !== null && 'code' in error && (error as PrismaError).code === 'P2003') {
      // Prisma error de clave foránea
      return NextResponse.json(
        { error: "Uno de los productos no existe en la base de datos." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Error interno del servidor" }, 
      { status: 500 }
    );
  }
}

// DELETE: Limpiar el carrito del usuario
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "No autenticado" }, 
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({ 
      where: { email: session.user.email } 
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" }, 
        { status: 404 }
      );
    }

    // El modelo cartItem no existe, por lo tanto no se puede limpiar el carrito
    // Si deseas implementar esta funcionalidad, primero crea el modelo cartItem en tu esquema de Prisma y ejecuta una migración.

    return NextResponse.json({ 
      error: "Funcionalidad no disponible: el modelo cartItem no existe en la base de datos." 
    }, { status: 501 });
  } catch (error) {
    console.error("Error limpiando carrito:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" }, 
      { status: 500 }
    );
  }
} 