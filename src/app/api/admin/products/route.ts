import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany();
  return NextResponse.json(products);
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id, isActive } = await req.json();
  const updated = await prisma.product.update({
    where: { id },
    data: { isActive },
  });
  return NextResponse.json(updated);
} 