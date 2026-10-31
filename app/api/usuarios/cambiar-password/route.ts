import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { passwordActual, passwordNueva } = body

    if (!passwordActual || !passwordNueva) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
    }

    if (passwordNueva.length < 6) {
      return NextResponse.json({ 
        error: 'La nueva contraseña debe tener al menos 6 caracteres' 
      }, { status: 400 })
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: session.user.id }
    })

    if (!usuario) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    let esValida = false
    try {
      esValida = await bcrypt.compare(passwordActual, usuario.password)
    } catch {
      esValida = false
    }

    if (!esValida) {
      esValida = usuario.password === passwordActual
    }

    if (!esValida) {
      return NextResponse.json({ 
        error: 'La contraseña actual es incorrecta' 
      }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(passwordNueva, 10)

    await prisma.usuario.update({
      where: { id: session.user.id },
      data: { password: hashedPassword }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Contraseña actualizada correctamente' 
    })

  } catch (error) {
    console.error('Error al cambiar contraseña:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}