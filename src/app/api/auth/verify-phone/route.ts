import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email, phone } = await request.json();
    
    console.log('🔍 Verificando número de teléfono para:', email);
    
    if (!email || !phone) {
      return NextResponse.json({ 
        error: 'Email y número de teléfono son requeridos.' 
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
    
    // Verificar que el usuario tenga teléfono configurado
    if (!user.phone) {
      console.log('Usuario sin teléfono configurado');
      return NextResponse.json({ 
        error: 'Esta cuenta no tiene configurado un número de teléfono. Contacta al administrador.' 
      }, { status: 400 });
    }
    
    // Verificar número de teléfono
    const isPhoneCorrect = user.phone === phone;
    
    if (!isPhoneCorrect) {
      console.log('Número de teléfono incorrecto');
      return NextResponse.json({ 
        error: 'El número de teléfono no coincide.' 
      }, { status: 400 });
    }
    
    console.log('✅ Número de teléfono verificado exitosamente');
    
    return NextResponse.json({ 
      success: true,
      message: 'Número de teléfono verificado correctamente.' 
    });
    
  } catch (error) {
    console.error('Error en verify-phone:', error);
    return NextResponse.json({ 
      error: 'Ocurrió un error al verificar el número de teléfono.' 
    }, { status: 500 });
  }
} 