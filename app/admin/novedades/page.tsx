import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ToastHandler from '@/components/ToastHandler'

async function eliminarNovedad(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const session = await auth()

  if (!session) return

  const novedad = await prisma.informe.findUnique({ where: { id } })
  if (!novedad) return

  const esAdmin = session.user.rol === 'ADMINISTRADOR'
  const esPropietario = novedad.tecnicoId === session.user.id

  if (esAdmin || esPropietario) {
    await prisma.informe.delete({ where: { id } })
    redirect('/admin/novedades?toast=deleted')
  }
}

export default async function NovedadesPage({ searchParams }: { searchParams: Promise<{ tecnicoId?: string, turno?: string }> }) {
  const { tecnicoId, turno } = await searchParams
  const session = await auth()
  if (!session) return null

  const esAdmin = session.user.rol === 'ADMINISTRADOR'

  const where: any = {}
  if (tecnicoId && tecnicoId !== 'TODOS') where.tecnicoId = tecnicoId
  if (turno && turno !== 'TODOS') where.turno = turno

  const novedades = await prisma.informe.findMany({
    where,
    include: { tecnico: true },
    orderBy: { createdAt: 'desc' }
  })

  const tecnicos = await prisma.usuario.findMany({
    where: { activo: true },
    orderBy: { nombre: 'asc' }
  })

  return (
    <div className="min-h-screen bg-slate-400 -m-4 md:-m-6 p-4 md:p-6 dark:bg-gray-900 transition-colors duration-300">
      <ToastHandler />
      
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Novedades</h1>
          <Link href="/admin/novedades/nueva" className="bg-blue-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-blue-700 text-sm md:text-base shadow-sm">
            + Nueva Novedad
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700">
          <form method="GET" className="flex flex-col md:flex-row gap-3 items-end">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Técnico</label>
              <select 
                name="tecnicoId" 
                defaultValue={tecnicoId || 'TODOS'}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="TODOS">Todos los técnicos</option>
                {tecnicos.map((t) => (
                  <option key={t.id} value={t.id}>{t.nombre}</option>
                ))}
              </select>
            </div>

            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Turno</label>
              <select 
                name="turno" 
                defaultValue={turno || 'TODOS'}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="TODOS">Todos los turnos</option>
                <option value="MANANA">Mañana</option>
                <option value="TARDE">Tarde</option>
                <option value="NOCHE">Noche</option>
              </select>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <button type="submit" className="flex-1 md:flex-none bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-900 font-semibold text-sm shadow-sm dark:bg-blue-600 dark:hover:bg-blue-700">
                🔍 Filtrar
              </button>
              <Link href="/admin/novedades" className="flex-1 md:flex-none bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 font-semibold text-sm text-center dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                Limpiar
              </Link>
            </div>
          </form>
        </div>

        {novedades.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center text-gray-500 dark:text-gray-400 border border-blue-100 dark:border-gray-700">
            <p>No se encontraron novedades con estos filtros.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {novedades.map((item) => {
              const puedeEditar = esAdmin || item.tecnicoId === session.user.id

              return (
                <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 relative border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
                  
                  {puedeEditar && (
                    <div className="absolute top-4 right-4 flex gap-3">
                      <Link 
                        href={`/admin/novedades/${item.id}/editar`} 
                        className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-800 text-sm font-medium shadow-sm"
                      >
                        ✏️ Editar
                      </Link>
                      <form action={eliminarNovedad}>
                        <input type="hidden" name="id" value={item.id} />
                        <button 
                          type="submit" 
                          className="bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-800 text-sm font-medium shadow-sm"
                        >
                          🗑️ Eliminar
                        </button>
                      </form>
                    </div>
                  )}

                  <div className={puedeEditar ? "pr-32" : ""}>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{item.tecnico.nombre}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(item.fecha).toLocaleDateString('es-ES', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <span className="inline-block mt-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-semibold px-3 py-1 rounded-full">
                      {item.turno === 'MANANA' ? '☀️ Mañana' : item.turno === 'TARDE' ? '🌤️ Tarde' : '🌙 Noche'}
                    </span>
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{item.novedades}</p>
                    </div>
                  </div>

                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}