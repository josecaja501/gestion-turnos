import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ToastHandler from '@/components/ToastHandler'

async function eliminarTarea(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const session = await auth()

  if (!session || session.user.rol !== 'ADMINISTRADOR') return

  await prisma.tareaDiaria.delete({ where: { id } })
  redirect('/admin/tareas?toast=deleted')
}

async function ratificarTarea(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const session = await auth()

  if (!session || session.user.rol !== 'ADMINISTRADOR') return

  await prisma.tareaDiaria.update({
    where: { id },
    data: { ratificada: true }
  })
  
  redirect('/admin/tareas?toast=updated')
}

export default async function TareasPage({ searchParams }: { searchParams: Promise<{ estado?: string, tecnicoId?: string, historial?: string }> }) {
  const { estado, tecnicoId, historial } = await searchParams
  const session = await auth()
  const esAdmin = session?.user?.rol === 'ADMINISTRADOR'

  // Filtro condicional: si NO es historial, solo mostramos no ratificadas
  const where: any = {}
  
  if (historial !== 'true') {
    where.AND = [{ ratificada: { equals: false } }]
  }
  
  if (estado && estado !== 'TODOS') where.estado = estado
  if (tecnicoId && tecnicoId !== 'TODOS') where.tecnicoId = tecnicoId

  const tareas = await prisma.tareaDiaria.findMany({
    where,
    include: { tecnico: true },
    orderBy: [{ fecha: 'desc' }, { turno: 'asc' }]
  })

  const tecnicos = await prisma.usuario.findMany({
    where: { rol: 'TECNICO', activo: true },
    orderBy: { nombre: 'asc' }
  })

  const getEstadoColor = (estado: string, ratificada: boolean) => {
    if (ratificada) return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
    switch (estado) {
      case 'REALIZADA': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'NO_REALIZADA': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    }
  }

  const getEstadoTexto = (estado: string, ratificada: boolean) => {
    if (ratificada) return '✓ Ratificada'
    switch (estado) {
      case 'REALIZADA': return 'Pendiente de Ratificar'
      case 'NO_REALIZADA': return 'No Realizada'
      default: return 'Pendiente'
    }
  }

  const getTurnoTexto = (turno: string) => {
    switch (turno) {
      case 'MANANA': return 'Mañana'
      case 'TARDE': return 'Tarde'
      default: return 'Noche'
    }
  }

  return (
    <div className="min-h-screen bg-slate-400 -m-4 md:-m-6 p-4 md:p-6 dark:bg-gray-900 transition-colors duration-300">
      <ToastHandler />
      
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Gestión de Tareas</h1>
          {esAdmin && (
            <Link href="/admin/tareas/nueva" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm md:text-base shadow-sm">
              + Nueva Tarea
            </Link>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700">
          <form method="GET" className="flex flex-col md:flex-row gap-3 items-end">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Estado</label>
              <select 
                name="estado" 
                defaultValue={estado || 'TODOS'}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="TODOS">Todos los estados</option>
                <option value="PENDIENTE">Pendiente</option>
                <option value="REALIZADA">Realizada</option>
                <option value="NO_REALIZADA">No Realizada</option>
              </select>
            </div>

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

            {esAdmin && (
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  name="historial"
                  value="true"
                  defaultChecked={historial === 'true'}
                  id="historial"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="historial" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mostrar historial (Ratificadas)
                </label>
              </div>
            )}

            <div className="flex gap-2 w-full md:w-auto">
              <button type="submit" className="flex-1 md:flex-none bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-900 font-semibold text-sm shadow-sm dark:bg-blue-600 dark:hover:bg-blue-700">
                🔍 Filtrar
              </button>
              <Link href="/admin/tareas" className="flex-1 md:flex-none bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 font-semibold text-sm text-center dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                Limpiar
              </Link>
            </div>
          </form>
        </div>

        {tareas.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center text-gray-500 dark:text-gray-400 border border-blue-100 dark:border-gray-700">
            <p>No se encontraron tareas con estos filtros.</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block rounded-xl shadow-lg overflow-hidden border border-blue-100 dark:border-gray-700">
              <table className="min-w-full divide-y divide-blue-100 dark:divide-gray-700">
                <thead className="bg-gradient-to-r from-blue-700 to-blue-900 dark:from-gray-800 dark:to-gray-900">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Turno</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Descripción</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Técnico</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-blue-50 dark:divide-gray-700">
                  {tareas.map((tarea) => (
                    <tr key={tarea.id} className={`hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors ${tarea.ratificada ? 'opacity-75' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {new Date(tarea.fecha).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {getTurnoTexto(tarea.turno)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate" title={tarea.descripcion}>
                        {tarea.descripcion}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {tarea.tecnico ? tarea.tecnico.nombre : 'Sin asignar'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoColor(tarea.estado, tarea.ratificada)}`}>
                          {getEstadoTexto(tarea.estado, tarea.ratificada)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {esAdmin ? (
                          tarea.estado === 'REALIZADA' && !tarea.ratificada ? (
                            <form action={ratificarTarea} className="inline">
                              <input type="hidden" name="id" value={tarea.id} />
                              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-semibold text-sm shadow-sm">
                                ✅ Ratificar
                              </button>
                            </form>
                          ) : tarea.ratificada ? (
                            <span className="text-gray-400 text-xs">Archivada</span>
                          ) : (
                            <>
                              <Link href={`/admin/tareas/editar/${tarea.id}`} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-800 font-semibold text-sm shadow-sm inline-block">
                                ✏️ Editar
                              </Link>
                              <form action={eliminarTarea} className="inline">
                                <input type="hidden" name="id" value={tarea.id} />
                                <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-800 font-semibold text-sm shadow-sm">
                                  🗑️ Eliminar
                                </button>
                              </form>
                            </>
                          )
                        ) : (
                          tarea.tecnicoId === session?.user?.id && tarea.estado === 'PENDIENTE' ? (
                            <Link href={`/admin/tareas/firmar/${tarea.id}`} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-800 font-semibold text-sm shadow-sm inline-block">
                              ✅ Firmar
                            </Link>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-3">
              {tareas.map((tarea) => (
                <div key={tarea.id} className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 space-y-3 border border-gray-100 dark:border-gray-700 ${tarea.ratificada ? 'opacity-75' : ''}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {new Date(tarea.fecha).toLocaleDateString('es-ES')} - {getTurnoTexto(tarea.turno)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {tarea.tecnico ? tarea.tecnico.nombre : 'Sin asignar'}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(tarea.estado, tarea.ratificada)}`}>
                      {getEstadoTexto(tarea.estado, tarea.ratificada)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{tarea.descripcion}</p>
                  {tarea.notas && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-2 rounded">
                      <p className="text-xs text-yellow-800 dark:text-yellow-200"><strong>Notas:</strong> {tarea.notas}</p>
                    </div>
                  )}
                  <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                    {esAdmin && tarea.estado === 'REALIZADA' && !tarea.ratificada ? (
                      <form action={ratificarTarea} className="flex-1">
                        <input type="hidden" name="id" value={tarea.id} />
                        <button type="submit" className="w-full bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 font-semibold text-sm text-center shadow-sm">
                          ✅ Ratificar
                        </button>
                      </form>
                    ) : tarea.tecnicoId === session?.user?.id && tarea.estado === 'PENDIENTE' ? (
                      <Link href={`/admin/tareas/firmar/${tarea.id}`} className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-800 font-semibold text-sm text-center shadow-sm">
                        ✅ Firmar / Realizar
                      </Link>
                    ) : (
                      <span className="text-gray-400 text-sm text-center w-full py-2">
                        {tarea.ratificada ? 'Archivada en historial' : 'Sin acciones disponibles'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}