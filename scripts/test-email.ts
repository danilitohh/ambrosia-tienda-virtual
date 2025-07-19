import { sendEmail } from '../src/lib/email'
import crypto from 'crypto'

async function testEmail() {
  console.log('🧪 Probando envío de email...')
  
  try {
    // Generar token como lo hace el endpoint real
    const token = crypto.randomBytes(32).toString('hex')
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3004'
    const link = `${baseUrl}/auth/reset-password/${token}`
    
    console.log('📧 Enviando email de recuperación de contraseña...')
    console.log('🔗 Enlace generado:', link)
    
    const result = await sendEmail({
      to: 'danilitohhhh@gmail.com',
      subject: 'Recupera tu contraseña',
      html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p><p><a href="${link}">${link}</a></p><p>Este enlace expirará en 1 hora.</p>`,
    })
    
    if (result.success) {
      console.log('✅ Email enviado exitosamente!')
      console.log('📧 Respuesta:', result.data)
    } else {
      console.error('❌ Error enviando email:', result.error)
    }
  } catch (error) {
    console.error('❌ Error en el script:', error)
  }
}

testEmail() 