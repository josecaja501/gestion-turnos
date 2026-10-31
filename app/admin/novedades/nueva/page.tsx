import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

async function crearNovedad(formData: FormData) {
  'use server'
  
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  const fecha = formData.get('fecha') as string
  const turno = formData.get('turno') as 'MANANA' | 'TARDE' | 'NOCHE'
  const novedades = formData.get('novedades') as string

  if (!fecha || !turno || !novedades) {
    redirect('/admin/novedades/nueva?toast=error')
  }

  await prisma.informe.create({
    data: {
      fecha: new Date(fecha),
      turno,
      novedades,
      tecnicoId: session.user.id
    }
  })

  redirect('/admin/novedades?toast=created')
}

export default async function NuevaNovedadPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-slate-400 -m-4 md:-m-6 p-4 md:p-6 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Nueva Novedad</h1>
          <Link href="/admin/novedades" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
            ← Volver
          </Link>
        </div>

        <form action={crearNovedad} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 border border-gray-100 dark:border-gray-700 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">Fecha *</label>
            <input 
              type="date" 
              name="fecha" 
              required 
              defaultValue={new Date().toISOString().split('T')[0]} 
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
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">Novedades *</label>
            <textarea 
              name="novedades" 
              required 
              rows={6} 
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 focus:border-blue-500 focus:outline-none"
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-bold transition-colors shadow-sm"
          >
            Guardar Novedad
          </button>
        </form>
      </div>
    </div>
  )
}