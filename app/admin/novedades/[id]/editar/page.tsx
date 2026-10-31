import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'

async function actualizarNovedad(id: string, formData: FormData) {
  'use server'

  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  const novedad = await prisma.informe.findUnique({ where: { id } })
  if (!novedad) {
    redirect('/admin/novedades?toast=error')
  }

  const esAdmin = session.user.rol === 'ADMINISTRADOR'
  const esPropietario = novedad.tecnicoId === session.user.id

  if (!esAdmin && !esPropietario) {
    redirect('/admin/novedades?toast=error')
  }

  const fecha = formData.get('fecha') as string
  const turno = formData.get('turno') as 'MANANA' | 'TARDE' | 'NOCHE'
  const novedades = formData.get('novedades') as string

  if (!fecha || !turno || !novedades) {
    redirect(`/admin/novedades/${id}/editar?toast=error`)
  }

  await prisma.informe.update({
    where: { id },
    data: {
      fecha: new Date(fecha),
      turno,
      novedades,
    },
  })

  redirect('/admin/novedades?toast=updated')
}

export default async function EditarNovedadPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  const novedad = await prisma.informe.findUnique({
    where: { id },
    include: { tecnico: true },
  })

  if (!novedad) {
    notFound()
  }

  const esAdmin = session.user.rol === 'ADMINISTRADOR'
  const esPropietario = novedad.tecnicoId === session.user.id

  if (!esAdmin && !esPropietario) {
    redirect('/admin/novedades?toast=error')
  }

  return (
    <div className="min-h-screen bg-slate-400 -m-4 md:-m-6 p-4 md:p-6 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Editar Novedad</h1>
          <Link href="/admin/novedades" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
            ← Volver
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 border border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
            Empleado: <strong className="text-gray-900 dark:text-white">{novedad.tecnico.nombre}</strong>
          </p>

          <form action={actualizarNovedad.bind(null, id)} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">
                Fecha <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="fecha"
                required
                defaultValue={new Date(novedad.fecha).toISOString().split('T')[0]}
                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">
                Turno <span className="text-red-500">*</span>
              </label>
              <select
                name="turno"
                defaultValue={novedad.turno}
                required
                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="MANANA">Mañana</option>
                <option value="TARDE">Tarde</option>
                <option value="NOCHE">Noche</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">
                Novedades del día <span className="text-red-500">*</span>
              </label>
              <textarea
                name="novedades"
                required
                rows={6}
                defaultValue={novedad.novedades}
                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 focus:border-blue-500 focus:outline-none"
                placeholder="Escribe aquí las novedades..."
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-bold transition-colors shadow-sm"
              >
                Guardar Cambios
              </button>
              <Link
                href="/admin/novedades"
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-bold text-center transition-colors shadow-sm"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}