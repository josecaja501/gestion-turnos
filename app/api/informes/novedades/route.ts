import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const inicio = searchParams.get('inicio')
    const fin = searchParams.get('fin')

    if (!inicio || !fin) {
      return NextResponse.json({ error: 'Fechas requeridas' }, { status: 400 })
    }

    const fechaInicio = new Date(inicio)
    const fechaFin = new Date(fin)
    fechaFin.setHours(23, 59, 59, 999)

    const informes = await prisma.informe.findMany({
      where: {
        fecha: {
          gte: fechaInicio,
          lte: fechaFin,
        },
      },
      include: { 
        tecnico: true
      },
      orderBy: { 
        fecha: 'asc' 
      },
    })

    return NextResponse.json(informes)
  } catch (error) {
    console.error('Error en API informes:', error)
    return NextResponse.json({ error: 'Error al obtener informes' }, { status: 500 })
  }
}