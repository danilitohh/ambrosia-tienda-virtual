import { prisma } from '../src/lib/prisma'

async function checkTokens() {
  try {
    console.log('🔑 Verificando tokens de recuperación de contraseña...')
    
    const tokens = await prisma.passwordResetToken.findMany({
      include: {
        user: {
          select: {
            email: true,
            name: true
          }
        }
      }
    })
    
    if (tokens.length === 0) {
      console.log('❌ No hay tokens de recuperación de contraseña')
    } else {
      console.log(`✅ Se encontraron ${tokens.length} tokens:`)
      tokens.forEach((token, index) => {
        const isExpired = new Date() > token.expires
        console.log(`${index + 1}. Usuario: ${token.user.email} (${token.user.name})`)
        console.log(`   Token: ${token.token.substring(0, 20)}...`)
        console.log(`   Expira: ${token.expires.toLocaleString()}`)
        console.log(`   Estado: ${isExpired ? '❌ Expirado' : '✅ Válido'}`)
        console.log(`   Creado: ${token.createdAt.toLocaleString()}`)
        console.log('')
      })
    }
  } catch (error) {
    console.error('❌ Error verificando tokens:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkTokens() 