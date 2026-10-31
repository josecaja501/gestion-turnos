import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import bcrypt from 'bcryptjs'

async function actualizarUsuario(id: string, formData: FormData) {
  'use server'
  
  const session = await auth()
  if (!session?.user || session.user.rol !== 'ADMINISTRADOR') {
    redirect('/login')
  }

  const nombre = formData.get('nombre') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const rol = formData.get('rol') as 'TECNICO' | 'ADMINISTRADOR'
  const activo = formData.get('activo') === 'on'

  if (!nombre || !email || !rol) {
    redirect(`/admin/usuarios/editar/${id}?toast=error`)
  }

  // Tipado estricto para el objeto de actualización
  const data: {
    nombre: string
    email: string
    rol: 'TECNICO' | 'ADMINISTRADOR'
    activo: boolean
    password?: string
  } = { 
    nombre, 
    email, 
    rol, 
    activo 
  }

  if (password && password.length >= 6) {
    data.password = await bcrypt.hash(password, 10)
  }

  await prisma.usuario.update({ 
    where: { id }, 
    data 
  })
  
  // Redirigimos con el mensaje para el toast
  redirect('/admin/usuarios?toast=updated')
}

export default async function EditarUsuarioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const session = await auth()
  if (!session?.user || session.user.rol !== 'ADMINISTRADOR') {
    redirect('/login')
  }

  const usuario = await prisma.usuario.findUnique({ where: { id } })
  if (!usuario) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-slate-400 -m-4 md:-m-6 p-4 md:p-6 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Editar Usuario: <span className="text-blue-600 dark:text-blue-400">{usuario.nombre}</span>
          </h1>
          <Link href="/admin/usuarios" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
            ← Volver
          </Link>
        </div>

        <form action={actualizarUsuario.bind(null, id)} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 border border-gray-100 dark:border-gray-700 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input 
              name="nombre" 
              defaultValue={usuario.nombre} 
              required 
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 focus:border-blue-500 focus:outline-none placeholder-gray-500 dark:placeholder-gray-400" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input 
              name="email" 
              type="email" 
              defaultValue={usuario.email} 
              required 
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 focus:border-blue-500 focus:outline-none placeholder-gray-500 dark:placeholder-gray-400" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">
              Contraseña (dejar vacío para no cambiar)
            </label>
            <input 
              name="password" 
              type="password" 
              minLength={6} 
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 focus:border-blue-500 focus:outline-none placeholder-gray-500 dark:placeholder-gray-400" 
              placeholder="Mínimo 6 caracteres" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1">
              Rol <span className="text-red-500">*</span>
            </label>
            <select 
              name="rol" 
              defaultValue={usuario.rol} 
              required 
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="TECNICO">Técnico</option>
              <option value="ADMINISTRADOR">Administrador</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2 pt-2">
            <input 
              name="activo" 
              type="checkbox" 
              defaultChecked={usuario.activo} 
              id="activo" 
              className="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 bg-gray-100 dark:bg-gray-700" 
            />
            <label htmlFor="activo" className="text-sm font-bold text-gray-900 dark:text-white">
              Usuario activo
            </label>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <button 
              type="submit" 
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-bold transition-colors shadow-sm"
            >
              Guardar Cambios
            </button>
            <Link 
              href="/admin/usuarios" 
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