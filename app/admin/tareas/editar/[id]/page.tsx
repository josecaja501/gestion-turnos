import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'

async function actualizarTarea(id: string, formData: FormData) {
  'use server'

  const session = await auth()
  if (!session?.user || session.user.rol !== 'ADMINISTRADOR') {
    redirect('/login')
  }

  const fecha = formData.get('fecha') as string
  const turno = formData.get('turno') as 'MANANA' | 'TARDE' | 'NOCHE'
  const descripcion = formData.get('descripcion') as string
  const tecnicoId = formData.get('tecnicoId') as string
  const estado = formData.get('estado') as 'PENDIENTE' | 'REALIZADA' | 'NO_REALIZADA'

  if (!fecha || !turno || !descripcion || !estado) {
    redirect(`/admin/tareas/editar/${id}?toast=error`)
  }

  await prisma.tareaDiaria.update({
    where: { id },
    data: {
      fecha: new Date(fecha),
      turno,
      descripcion,
      tecnicoId: tecnicoId === '' ? null : tecnicoId,
      estado,
    },
  })

  redirect('/admin/tareas?toast=updated')
}

export default async function EditarTareaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()

  if (!session?.user || session.user.rol !== 'ADMINISTRADOR') {
    redirect('/login')
  }

  const tarea = await prisma.tareaDiaria.findUnique({
    where: { id },
    include: { tecnico: true },
  })

  if (!tarea) {
    notFound()
  }

  const tecnicos = await prisma.usuario.findMany({
    where: { activo: true, rol: 'TECNICO' },
    orderBy: { nombre: 'asc' }
  })

  return (
    <div className="min-h-screen bg-slate-400 -m-4 md:-m-6 p-4 md:p-6 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Editar Tarea</h1>
          <Link href="/admin/tareas" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
            ← Volver
          </Link>
        </div>

        <form action={actualizarTarea.bind(null, id)} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 border border-gray-100 dark:border-gray-700 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">
              Fecha <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="fecha"
              required
              defaultValue={new Date(tarea.fecha).toISOString().split('T')[0]}
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">
              Turno <span className="text-red-500">*</span>
            </label>
            <select
              name="turno"
              required
              defaultValue={tarea.turno}
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="MANANA">Mañana</option>
              <option value="TARDE">Tarde</option>
              <option value="NOCHE">Noche</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              name="descripcion"
              required
              rows={4}
              defaultValue={tarea.descripcion}
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">
              Técnico asignado
            </label>
            <select
              name="tecnicoId"
              defaultValue={tarea.tecnicoId || ''}
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Sin asignar</option>
              {tecnicos.map((tecnico) => (
                <option key={tecnico.id} value={tecnico.id}>
                  {tecnico.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">
              Estado
            </label>
            <select
              name="estado"
              defaultValue={tarea.estado}
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="PENDIENTE">Pendiente</option>
              <option value="REALIZADA">Realizada</option>
              <option value="NO_REALIZADA">No Realizada</option>
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-bold transition-colors shadow-sm"
            >
              Guardar Cambios
            </button>
            <Link
              href="/admin/tareas"
              className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-bold text-center transition-colors shadow-sm"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}