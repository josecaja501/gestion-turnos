import Link from 'next/link'

export default function CerrarSesionPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">👋</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">¿Seguro que quieres salir?</h1>
        <p className="text-gray-500 mb-8">
          Vas a cerrar tu sesión en el sistema de Gestión de Turnos.
        </p>

        <div className="flex flex-col gap-3">
          <a
            href="/api/auth/signout?callbackUrl=/login"
            className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Sí, cerrar sesión
          </a>
          <Link
            href="/admin"
            className="w-full bg-slate-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-slate-300 transition-colors"
          >
            No, volver al panel
          </Link>
        </div>
      </div>
    </div>
  )
}