import { sendEmail } from '../src/lib/email'

async function testEmail() {
  console.log('🧪 Probando envío de email detallado...')
  
  // Verificar variables de entorno
  console.log('📋 Verificando variables de entorno:')
  console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Configurado' : '❌ No configurado')
  console.log('EMAIL_FROM:', process.env.EMAIL_FROM || '❌ No configurado')
  console.log('NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL || '❌ No configurado')
  
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY no está configurado')
    return
  }
  
  if (!process.env.EMAIL_FROM) {
    console.error('❌ EMAIL_FROM no está configurado')
    return
  }
  
  try {
    console.log('📧 Enviando email de prueba...')
    
    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Prueba de email - Ambrosia',
      html: `
        <h1>Prueba de email</h1>
        <p>Este es un email de prueba para verificar que el sistema de emails funciona correctamente.</p>
        <p>Fecha: ${new Date().toLocaleString()}</p>
        <p>Si recibes este email, el sistema está funcionando correctamente.</p>
      `
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