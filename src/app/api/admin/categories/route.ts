import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc'
    }
  });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, description, image, slug } = await req.json();
    
    if (!name) {
      return NextResponse.json({ error: "Nombre de categoría es requerido" }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        name,
        description: description || "",
        image: image || "",
        slug: slug || name.toLowerCase().replace(/\s+/g, '-')
      }
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ error: "Error al crear la categoría" }, { status: 500 });
  }
} 