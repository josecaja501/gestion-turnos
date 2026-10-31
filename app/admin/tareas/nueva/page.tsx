import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

async function crearTarea(formData: FormData) {
  'use server'
  
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  const fecha = formData.get('fecha') as string
  const turno = formData.get('turno') as 'MANANA' | 'TARDE' | 'NOCHE'
  const descripcion = formData.get('descripcion') as string
  const tecnicoId = formData.get('tecnicoId') as string
  const notas = formData.get('notas') as string

  if (!fecha || !turno || !descripcion) {
    redirect('/admin/tareas/nueva?toast=error')
  }

  await prisma.tareaDiaria.create({
    data: {
      fecha: new Date(fecha),
      turno,
      descripcion,
      tecnicoId: tecnicoId === '' ? null : tecnicoId,
      notas: notas === '' ? null : notas,
      estado: 'PENDIENTE'
    }
  })

  redirect('/admin/tareas?toast=created')
}

export default async function NuevaTareaPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  const tecnicos = await prisma.usuario.findMany({
    where: { activo: true, rol: 'TECNICO' },
    orderBy: { nombre: 'asc' }
  })

  return (
    <div className="min-h-screen bg-slate-400 -m-4 md:-m-6 p-4 md:p-6 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Nueva Tarea</h1>
          <Link href="/admin/tareas" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
            ← Volver
          </Link>
        </div>

        <form action={crearTarea} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 border border-gray-100 dark:border-gray-700 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">Fecha *</label>
            <input 
              type="date" 
              name="fecha" 
              required 
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 focus:border-blue-500 focus:outline-none" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">Turno *</label>
            <select 
              name="turno" 
              required 
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="MANANA">Mañana</option>
              <option value="TARDE">Tarde</option>
              <option value="NOCHE">Noche</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">Técnico</label>
            <select 
              name="tecnicoId" 
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Sin asignar</option>
              {tecnicos.map((t) => (
                <option key={t.id} value={t.id}>{t.nombre}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">Descripción *</label>
            <textarea 
              name="descripcion" 
              required 
              rows={3} 
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 focus:border-blue-500 focus:outline-none"
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">Notas (opcional)</label>
            <textarea 
              name="notas" 
              rows={2} 
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 focus:border-blue-500 focus:outline-none"
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-bold transition-colors shadow-sm"
          >
            Crear Tarea
          </button>
        </form>
      </div>
    </div>
  )
}