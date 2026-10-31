'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function PerfilPage() {
  const [passwordActual, setPasswordActual] = useState('')
  const [passwordNueva, setPasswordNueva] = useState('')
  const [passwordConfirmar, setPasswordConfirmar] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordNueva !== passwordConfirmar) {
      toast.error('Las contraseñas nuevas no coinciden')
      return
    }

    if (passwordNueva.length < 6) {
      toast.error('La nueva contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/usuarios/cambiar-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passwordActual, passwordNueva })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('✅ Contraseña actualizada correctamente')
        setPasswordActual('')
        setPasswordNueva('')
        setPasswordConfirmar('')
      } else {
        toast.error(data.error || 'Error al cambiar la contraseña')
      }
    } catch (err) {
      toast.error('Error de conexión con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-400 -m-4 md:-m-6 p-4 md:p-6 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 dark:text-white">Mi Perfil</h1>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 mb-4 dark:text-white">Cambiar Contraseña</h2>
          <p className="text-sm text-gray-600 mb-6 dark:text-gray-300">
            Por seguridad, debes introducir tu contraseña actual antes de establecer una nueva.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1 dark:text-white">
                Contraseña actual
              </label>
              <input
                type="password"
                value={passwordActual}
                onChange={(e) => setPasswordActual(e.target.value)}
                required
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-900 focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1 dark:text-white">
                Nueva contraseña
              </label>
              <input
                type="password"
                value={passwordNueva}
                onChange={(e) => setPasswordNueva(e.target.value)}
                required
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-900 focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1 dark:text-white">
                Confirmar nueva contraseña
              </label>
              <input
                type="password"
                value={passwordConfirmar}
                onChange={(e) => setPasswordConfirmar(e.target.value)}
                required
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-900 focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Repite la nueva contraseña"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors disabled:bg-gray-400 shadow-sm"
              >
                {loading ? 'Guardando...' : 'Cambiar Contraseña'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 font-semibold transition-colors shadow-sm dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}