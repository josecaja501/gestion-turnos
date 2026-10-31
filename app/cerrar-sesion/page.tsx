'use client'

import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'

export default function CerrarSesionPage() {
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">👋</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">¿Seguro que quieres salir?</h1>
        <p className="text-gray-500 mb-8">
          Vas a cerrar tu sesión en el sistema de Gestión de Turnos.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleSignOut}
            className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors cursor-pointer"
          >
            Sí, cerrar sesión
          </button>
          <button
            onClick={() => router.push('/admin')}
            className="w-full bg-slate-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-slate-300 transition-colors cursor-pointer"
          >
            No, volver al panel
          </button>
        </div>
      </div>
    </div>
  )
}