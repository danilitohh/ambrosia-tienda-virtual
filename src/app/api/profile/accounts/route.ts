import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ providers: [] }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { accounts: true },
  });
  if (!user) {
    return NextResponse.json({ providers: [] }, { status: 404 });
  }
  const providers = user.accounts.map(acc => acc.provider);
  return NextResponse.json({ providers });
} 