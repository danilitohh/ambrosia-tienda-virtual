import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    console.log('🔍 Iniciando proceso de recuperación para:', email);
    
    if (!email) {
      console.error('No se recibió email');
      return NextResponse.json({ error: 'El correo es requerido.' }, { status: 400 });
    }
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Por seguridad, no revelar si el usuario existe o no
      console.log('Usuario no encontrado:', email);
      return NextResponse.json({ message: 'Si el correo existe, recibirás un enlace para restablecer tu contraseña.' });
    }
    
    console.log('✅ Usuario encontrado:', user.email);
    
    // Generar token seguro
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
    console.log('🔑 Token generado:', token.substring(0, 20) + '...');
    
    // Eliminar tokens previos
    try {
      await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
      console.log('🗑️ Tokens previos eliminados');
    } catch (err) {
      console.error('Error eliminando tokens previos:', err);
    }
    
    // Guardar token
    try {
      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          token,
          expires,
        },
      });
      console.log('💾 Token guardado en base de datos');
    } catch (err) {
      console.error('Error creando token:', err);
      return NextResponse.json({ error: 'Error creando token.' }, { status: 500 });
    }
    
    // Construir enlace
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3004';
    const link = `${baseUrl}/auth/reset-password/${token}`;
    console.log('🔗 Enlace generado:', link);
    
    // Enviar email real
    try {
      console.log('📧 Iniciando envío de email...');
      const emailResult = await sendEmail({
        to: email,
        subject: 'Recupera tu contraseña - Ambrosia',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h1 style="color: #333; text-align: center; margin-bottom: 30px;">🔐 Recupera tu contraseña</h1>
              
              <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                Hola, hemos recibido una solicitud para restablecer la contraseña de tu cuenta en Ambrosia.
              </p>
              
              <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                Haz clic en el botón de abajo para crear una nueva contraseña:
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${link}" style="background-color: #C6FF00; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px;">
                  Restablecer Contraseña
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
                Si el botón no funciona, copia y pega este enlace en tu navegador:
              </p>
              
              <p style="color: #007bff; font-size: 14px; word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 5px; margin-bottom: 30px;">
                ${link}
              </p>
              
              <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
                <p style="color: #888; font-size: 12px; margin-bottom: 10px;">
                  ⏰ Este enlace expirará en 1 hora por seguridad.
                </p>
                <p style="color: #888; font-size: 12px; margin-bottom: 10px;">
                  🚫 Si no solicitaste este cambio, puedes ignorar este email.
                </p>
                <p style="color: #888; font-size: 12px;">
                  📧 Si tienes problemas, contacta a nuestro equipo de soporte.
                </p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px; color: #888; font-size: 12px;">
              <p>© 2024 Ambrosia. Todos los derechos reservados.</p>
            </div>
          </div>
        `,
      });
      
      console.log('📧 Resultado del envío:', emailResult);
      
      if (!emailResult.success) {
        console.error('Error enviando email:', emailResult.error);
        return NextResponse.json({ error: 'Error enviando email.' }, { status: 500 });
      }
      
      console.log('✅ Email enviado exitosamente');
    } catch (err) {
      console.error('Error en sendEmail:', err);
      return NextResponse.json({ error: 'Error enviando email.' }, { status: 500 });
    }
    
    console.log('🎉 Proceso completado exitosamente');
    return NextResponse.json({ message: 'Si el correo existe, recibirás un enlace para restablecer tu contraseña.' });
  } catch (error) {
    console.error('Error general en forgot-password:', error);
    return NextResponse.json({ error: 'Ocurrió un error.' }, { status: 500 });
  }
} 