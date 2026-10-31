import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await auth()
  const esAdmin = session?.user?.rol === 'ADMINISTRADOR'

  const totalTareas = await prisma.tareaDiaria.count()
  const tareasPendientes = await prisma.tareaDiaria.count({ where: { estado: 'PENDIENTE' } })
  const tareasRealizadas = await prisma.tareaDiaria.count({ where: { estado: 'REALIZADA' } })
  const totalNovedades = await prisma.informe.count()
  const totalUsuarios = await prisma.usuario.count()

  return (
    <div className="min-h-screen bg-slate-400 -m-4 md:-m-6 p-4 md:p-6">
      <div className="space-y-6 max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
            <p className="text-sm text-gray-500 mb-1">Total Tareas</p>
            <p className="text-3xl font-bold text-gray-900">{totalTareas}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <p className="text-sm text-gray-500 mb-1">Tareas Pendientes</p>
            <p className="text-3xl font-bold text-gray-900">{tareasPendientes}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <p className="text-sm text-gray-500 mb-1">Tareas Realizadas</p>
            <p className="text-3xl font-bold text-gray-900">{tareasRealizadas}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <p className="text-sm text-gray-500 mb-1">Total Novedades</p>
            <p className="text-3xl font-bold text-gray-900">{totalNovedades}</p>
          </div>

          {esAdmin && (
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
              <p className="text-sm text-gray-500 mb-1">Total Usuarios</p>
              <p className="text-3xl font-bold text-gray-900">{totalUsuarios}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/admin/tareas" className="bg-blue-600 text-white p-6 rounded-xl shadow-lg hover:bg-blue-700 transition-colors">
            <h3 className="text-xl font-bold mb-2">✅ Gestión de Tareas</h3>
            <p className="text-blue-100">Ver y gestionar todas las tareas</p>
          </Link>

          <Link href="/admin/novedades" className="bg-green-600 text-white p-6 rounded-xl shadow-lg hover:bg-green-700 transition-colors">
            <h3 className="text-xl font-bold mb-2">📝 Novedades</h3>
            <p className="text-green-100">Ver y gestionar novedades</p>
          </Link>

          {esAdmin && (
            <>
              <Link href="/admin/usuarios" className="bg-purple-600 text-white p-6 rounded-xl shadow-lg hover:bg-purple-700 transition-colors">
                <h3 className="text-xl font-bold mb-2">👥 Usuarios</h3>
                <p className="text-purple-100">Gestionar usuarios del sistema</p>
              </Link>

              <Link href="/admin/informes" className="bg-orange-600 text-white p-6 rounded-xl shadow-lg hover:bg-orange-700 transition-colors">
                <h3 className="text-xl font-bold mb-2"> Informes</h3>
                <p className="text-orange-100">Generar informes en PDF</p>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}