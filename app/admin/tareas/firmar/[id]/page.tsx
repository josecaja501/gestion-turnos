import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'

async function firmarTarea(formData: FormData) {
  'use server'
  
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  const id = formData.get('id') as string
  const notas = formData.get('notas') as string

  const tarea = await prisma.tareaDiaria.findUnique({ where: { id } })
  if (!tarea) {
    redirect('/admin/tareas?toast=error')
  }

  if (tarea.tecnicoId !== session.user.id && session.user.rol !== 'ADMINISTRADOR') {
    redirect('/admin/tareas?toast=error')
  }

  await prisma.tareaDiaria.update({
    where: { id },
    data: {
      estado: 'REALIZADA',
      notas: notas === '' ? null : notas,
      horaFirma: new Date(),
      ratificada: false // Se mantiene explícitamente en false para que el admin la vea pendiente de ratificar
    }
  })

  redirect('/admin/tareas?toast=updated')
}

export default async function FirmarTareaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  const tarea = await prisma.tareaDiaria.findUnique({
    where: { id },
    include: { tecnico: true }
  })

  if (!tarea) {
    notFound()
  }

  if (tarea.tecnicoId !== session.user.id && session.user.rol !== 'ADMINISTRADOR') {
    redirect('/admin/tareas?toast=error')
  }

  return (
    <div className="min-h-screen bg-slate-400 -m-4 md:-m-6 p-4 md:p-6 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Firmar y Completar Tarea</h1>
          <Link href="/admin/tareas" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
            ← Volver
          </Link>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 border border-gray-100 dark:border-gray-700 mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Descripción de la tarea:</p>
          <p className="text-gray-900 dark:text-white font-medium text-lg">{tarea.descripcion}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
            <strong>Fecha:</strong> {new Date(tarea.fecha).toLocaleDateString('es-ES')} | 
            <strong> Turno:</strong> {tarea.turno === 'MANANA' ? 'Mañana' : tarea.turno === 'TARDE' ? 'Tarde' : 'Noche'}
          </p>
        </div>

        <form action={firmarTarea} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 border border-gray-100 dark:border-gray-700 space-y-4">
          <input type="hidden" name="id" value={tarea.id} />
          
          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">
              Notas u observaciones (opcional)
            </label>
            <textarea
              name="notas"
              rows={4}
              defaultValue={tarea.notas || ''}
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 focus:border-blue-500 focus:outline-none"
              placeholder="Ej: Se completó la revisión, todo en orden. Se sustituyó la pieza X..."
            ></textarea>
          </div>

          <div className="flex flex-col md:flex-row gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-bold transition-colors shadow-sm"
            >
              ✅ Confirmar como Realizada
            </button>
            <Link
              href="/admin/tareas"
              className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-bold transition-colors text-center shadow-sm"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}