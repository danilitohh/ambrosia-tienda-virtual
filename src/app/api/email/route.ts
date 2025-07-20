export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { rateLimiters } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // Rate limiting para emails
    const rateLimitResult = rateLimiters.strict(req);
    if (rateLimitResult) return rateLimitResult;

    const body = await req.json();
    console.log("[EMAIL API] Body recibido:", body);
    const { to, subject, html } = body;
    
    // Validación mejorada
    if (!to || !subject || !html) {
      console.error("[EMAIL API] Faltan campos obligatorios", { to, subject, html });
      return NextResponse.json({ 
        success: false, 
        error: "Faltan campos obligatorios" 
      }, { status: 400 });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      console.error("[EMAIL API] Formato de email inválido", to);
      return NextResponse.json({ 
        success: false, 
        error: "Formato de email inválido" 
      }, { status: 400 });
    }

    const result = await sendEmail({ to, subject, html });
    console.log("[EMAIL API] Resultado de sendEmail:", result);
    
    if (result.success) {
      return NextResponse.json({ 
        success: true,
        message: "Email enviado correctamente"
      });
    } else {
      console.error("[EMAIL API] Error al enviar:", result.error);
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 500 });
    }
  } catch (error) {
    console.error("[EMAIL API] Error enviando email:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Error interno del servidor" 
    }, { status: 500 });
  }
} 