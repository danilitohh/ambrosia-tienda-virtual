import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    console.log('🔍 Obteniendo pregunta de seguridad para:', email);
    
    if (!email) {
      return NextResponse.json({ 
        error: 'El email es requerido.' 
      }, { status: 400 });
    }
    
    // Buscar usuario por email
    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive'
        }
      },
      select: {
        id: true,
        email: true,
        securityQuestion: true
      }
    });
    
    if (!user) {
      console.log('Usuario no encontrado:', email);
      return NextResponse.json({ 
        error: 'No se encontró una cuenta con ese email.' 
      }, { status: 404 });
    }
    
    console.log('✅ Usuario encontrado:', user.email);
    
    // Verificar que el usuario tenga pregunta de seguridad configurada
    if (!user.securityQuestion) {
      console.log('Usuario sin pregunta de seguridad configurada');
      return NextResponse.json({ 
        error: 'Esta cuenta no tiene configurada una pregunta de seguridad. Contacta al administrador.' 
      }, { status: 400 });
    }
    
    console.log('✅ Pregunta de seguridad encontrada');
    
    return NextResponse.json({ 
      success: true,
      securityQuestion: user.securityQuestion
    });
    
  } catch (error) {
    console.error('Error en get-security-question:', error);
    return NextResponse.json({ 
      error: 'Ocurrió un error al obtener la pregunta de seguridad.' 
    }, { status: 500 });
  }
} 