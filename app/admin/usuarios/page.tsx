import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ToastHandler from '@/components/ToastHandler'

async function eliminarUsuario(formData: FormData) {
  'use server'
  const session = await auth()
  if (!session?.user || session.user.rol !== 'ADMINISTRADOR') {
    redirect('/login')
  }

  const id = formData.get('id') as string

  // No permitir que un admin se elimine a sí mismo
  if (session.user.id === id) {
    redirect('/admin/usuarios?toast=error')
  }

  await prisma.usuario.delete({ where: { id } })
  
  // Redirigimos con el mensaje para el toast
  redirect('/admin/usuarios?toast=deleted')
}

export default async function UsuariosPage() {
  const session = await auth()
  const esAdmin = session?.user?.rol === 'ADMINISTRADOR'

  const usuarios = await prisma.usuario.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="min-h-screen bg-slate-400 -m-4 md:-m-6 p-4 md:p-6 dark:bg-gray-900 transition-colors duration-300">
      <ToastHandler />
      
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Gestión de Usuarios</h1>
          {esAdmin && (
            <Link href="/admin/usuarios/nuevo" className="bg-blue-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-blue-700 text-sm md:text-base shadow-sm">
              + Nuevo Usuario
            </Link>
          )}
        </div>

        {usuarios.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center text-gray-500 dark:text-gray-400 border border-blue-100 dark:border-gray-700">
            <p>Aún no hay usuarios registrados.</p>
          </div>
        ) : (
          <>
            {/* VISTA DESKTOP: Tabla elegante azul */}
            <div className="hidden md:block rounded-xl shadow-lg overflow-hidden border border-blue-100 dark:border-gray-700">
              <table className="min-w-full divide-y divide-blue-100 dark:divide-gray-700">
                <thead className="bg-gradient-to-r from-blue-700 to-blue-900 dark:from-gray-800 dark:to-gray-900">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Rol</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Estado</th>
                    {esAdmin && <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Acciones</th>}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-blue-50 dark:divide-gray-700">
                  {usuarios.map((usuario) => (
                    <tr key={usuario.id} className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {usuario.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {usuario.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                          usuario.rol === 'ADMINISTRADOR' 
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                          {usuario.rol === 'ADMINISTRADOR' ? '👑 Administrador' : '🔧 Técnico'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          usuario.activo 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {usuario.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      {esAdmin && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <Link 
                            href={`/admin/usuarios/editar/${usuario.id}`} 
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-800 font-semibold text-sm shadow-sm inline-block"
                          >
                            ✏️ Editar
                          </Link>
                          {usuario.id !== session?.user?.id && (
                            <form action={eliminarUsuario} className="inline">
                              <input type="hidden" name="id" value={usuario.id} />
                              <button 
                                type="submit" 
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-800 font-semibold text-sm shadow-sm"
                              >
                                🗑️ Eliminar
                              </button>
                            </form>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* VISTA MÓVIL: Tarjetas */}
            <div className="md:hidden space-y-3">
              {usuarios.map((usuario) => (
                <div key={usuario.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 space-y-3 border border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{usuario.nombre}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{usuario.email}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      usuario.activo 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {usuario.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      usuario.rol === 'ADMINISTRADOR' 
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {usuario.rol === 'ADMINISTRADOR' ? '👑 Administrador' : '🔧 Técnico'}
                    </span>
                  </div>

                  {esAdmin && (
                    <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                      <Link 
                        href={`/admin/usuarios/editar/${usuario.id}`} 
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-800 font-semibold text-sm text-center shadow-sm"
                      >
                        ✏️ Editar
                      </Link>
                      {usuario.id !== session?.user?.id && (
                        <form action={eliminarUsuario} className="flex-1">
                          <input type="hidden" name="id" value={usuario.id} />
                          <button 
                            type="submit" 
                            className="w-full bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-800 font-semibold text-sm shadow-sm"
                          >
                            🗑️ Eliminar
                          </button>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}