import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { email, securityAnswer } = await request.json();
    
    console.log('🔍 Verificando respuesta de seguridad para:', email);
    
    if (!email || !securityAnswer) {
      return NextResponse.json({ 
        error: 'Email y respuesta de seguridad son requeridos.' 
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
    
    // Verificar que el usuario tenga respuesta de seguridad configurada
    if (!user.securityAnswer) {
      console.log('Usuario sin respuesta de seguridad configurada');
      return NextResponse.json({ 
        error: 'Esta cuenta no tiene configurada una respuesta de seguridad. Contacta al administrador.' 
      }, { status: 400 });
    }
    
    // Verificar respuesta de seguridad (case insensitive)
    const isSecurityAnswerCorrect = user.securityAnswer.toLowerCase().trim() === securityAnswer.toLowerCase().trim();
    
    if (!isSecurityAnswerCorrect) {
      console.log('Respuesta de seguridad incorrecta');
      return NextResponse.json({ 
        error: 'La respuesta de seguridad es incorrecta.' 
      }, { status: 400 });
    }
    
    console.log('✅ Respuesta de seguridad verificada exitosamente');
    
    return NextResponse.json({ 
      success: true,
      message: 'Respuesta de seguridad verificada correctamente.' 
    });
    
  } catch (error) {
    console.error('Error en verify-security-answer:', error);
    return NextResponse.json({ 
      error: 'Ocurrió un error al verificar la respuesta de seguridad.' 
    }, { status: 500 });
  }
} 