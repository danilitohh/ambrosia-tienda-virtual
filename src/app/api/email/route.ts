import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { rateLimiters } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // Rate limiting para emails
    const rateLimitResult = rateLimiters.strict(req);
    if (rateLimitResult) return rateLimitResult;

    const { to, subject, html } = await req.json();
    
    // Validación mejorada
    if (!to || !subject || !html) {
      return NextResponse.json({ 
        success: false, 
        error: "Faltan campos obligatorios" 
      }, { status: 400 });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return NextResponse.json({ 
        success: false, 
        error: "Formato de email inválido" 
      }, { status: 400 });
    }

    const result = await sendEmail({ to, subject, html });
    
    if (result.success) {
      return NextResponse.json({ 
        success: true,
        message: "Email enviado correctamente"
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Error enviando email:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Error interno del servidor" 
    }, { status: 500 });
  }
} 