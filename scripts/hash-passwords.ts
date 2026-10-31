import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function hashPasswords() {
  console.log('🔐 Iniciando proceso de hash de contraseñas...')

  // Obtener todos los usuarios
  const usuarios = await prisma.usuario.findMany()
  console.log(`📋 Encontrados ${usuarios.length} usuarios`)

  let count = 0

  for (const usuario of usuarios) {
    // Verificar si la contraseña ya está hasheada (empieza con $2a$)
    if (!usuario.password.startsWith('$2a$')) {
      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(usuario.password, 10)
      
      // Actualizar en la base de datos
      await prisma.usuario.update({
        where: { id: usuario.id },
        data: { password: hashedPassword }
      })

      console.log(`✅ Contraseña hasheada para: ${usuario.email}`)
      count++
    } else {
      console.log(`⏭️ Ya hasheada: ${usuario.email}`)
    }
  }

  console.log(`\n Proceso completado. ${count} contraseñas han sido hasheadas.`)
  await prisma.$disconnect()
}

hashPasswords().catch((error) => {
  console.error('❌ Error:', error)
  process.exit(1)
})