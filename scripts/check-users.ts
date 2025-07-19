import { prisma } from '../src/lib/prisma'

async function checkUsers() {
  try {
    console.log('👥 Verificando usuarios en la base de datos...')
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        role: true
      }
    })
    
    if (users.length === 0) {
      console.log('❌ No hay usuarios en la base de datos')
    } else {
      console.log(`✅ Se encontraron ${users.length} usuarios:`)
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.role} - Creado: ${user.createdAt.toLocaleDateString()}`)
      })
    }
  } catch (error) {
    console.error('❌ Error verificando usuarios:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUsers() 