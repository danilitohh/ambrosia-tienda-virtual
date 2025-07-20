import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { email, newPassword } = await request.json();
    
    console.log('🔍 Actualizando contraseña para:', email);
    
    if (!email || !newPassword) {
      return NextResponse.json({ 
        error: 'Email y nueva contraseña son requeridos.' 
      }, { status: 400 });
    }
    
    // Validar longitud de contraseña
    if (newPassword.length < 6) {
      return NextResponse.json({ 
        error: 'La contraseña debe tener al menos 6 caracteres.' 
      }, { status: 400 });
    }
    
    // Buscar usuario por email
    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive'
        }
      }
    });
    
    if (!user) {
      console.log('Usuario no encontrado:', email);
      return NextResponse.json({ 
        error: 'No se encontró una cuenta con ese email.' 
      }, { status: 404 });
    }
    
    console.log('✅ Usuario encontrado:', user.email);
    
    console.log('✅ Usuario encontrado, procediendo a actualizar contraseña');
    
    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Actualizar contraseña
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });
    
    console.log('✅ Contraseña actualizada exitosamente');
    
    return NextResponse.json({ 
      success: true,
      message: 'Contraseña actualizada correctamente.' 
    });
    
  } catch (error) {
    console.error('Error en reset-password-security:', error);
    return NextResponse.json({ 
      error: 'Ocurrió un error al actualizar la contraseña.' 
    }, { status: 500 });
  }
} 