import { prisma } from '../src/lib/prisma'

async function updateUserEmail() {
  try {
    console.log('📧 Actualizando email del usuario...')
    
    // Actualizar el email del usuario existente
    const updatedUser = await prisma.user.update({
      where: { email: 'danilitohhhh@gmail.com' },
      data: { email: 'danilitohhh@gmail.com' }
    })
    
    console.log('✅ Email actualizado exitosamente!')
    console.log('👤 Usuario:', updatedUser.name)
    console.log('📧 Nuevo email:', updatedUser.email)
  } catch (error) {
    console.error('❌ Error actualizando email:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateUserEmail() 