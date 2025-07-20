export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();
    if (!token || !password) {
      return NextResponse.json({ error: 'Faltan datos.' }, { status: 400 });
    }
    // Buscar el token
    const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });
    if (!resetToken || resetToken.expires < new Date()) {
      return NextResponse.json({ error: 'El enlace es inválido o ha expirado.' }, { status: 400 });
    }
    // Actualizar la contraseña del usuario
    const hashed = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashed },
    });
    // Eliminar el token usado
    await prisma.passwordResetToken.delete({ where: { token } });
    return NextResponse.json({ message: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    return NextResponse.json({ error: 'Ocurrió un error.' }, { status: 500 });
  }
} 