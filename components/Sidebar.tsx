'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from './Logo'

interface SidebarProps {
  esAdmin: boolean
  userName: string
  userEmail: string
}

export default function Sidebar({ esAdmin, userName, userEmail }: SidebarProps) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin'
    }
    return pathname === path || pathname.startsWith(path + '/')
  }

  const linkClass = (path: string) => {
    const base = 'block px-4 py-3 rounded-lg font-medium transition-colors'
    if (isActive(path)) {
      return `${base} bg-blue-600 text-white`
    }
    return `${base} text-slate-300 hover:bg-slate-800`
  }

  return (
    <aside className="hidden md:flex w-64 bg-slate-900 text-white flex-col fixed md:relative h-full z-40">
      <div className="p-6 border-b border-slate-700">
        <Logo size="small" showText={true} />
        <p className="text-xs text-slate-400 mt-3">
          {esAdmin ? 'Panel Admin' : 'Panel Operario'}
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {esAdmin && (
          <Link href="/admin" className={linkClass('/admin')}>
            📊 Dashboard
          </Link>
        )}
        <Link href="/admin/novedades" className={linkClass('/admin/novedades')}>
          📝 Novedades
        </Link>
        {esAdmin && (
          <>
            <Link href="/admin/usuarios" className={linkClass('/admin/usuarios')}>
              👥 Usuarios
            </Link>
            <Link href="/admin/informes" className={linkClass('/admin/informes')}>
              📄 Informes
            </Link>
          </>
        )}
        <Link href="/admin/tareas" className={linkClass('/admin/tareas')}>
          ✅ Tareas
        </Link>
        <Link href="/admin/perfil" className={linkClass('/admin/perfil')}>
          👤 Mi Perfil
        </Link>
      </nav>

      <div className="p-4 border-t border-slate-700">
        <p className="text-sm text-slate-300 mb-1">{userName}</p>
        <p className="text-xs text-slate-500 mb-3">{userEmail}</p>
        <Link href="/cerrar-sesion" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-lg">
          🚪 Cerrar sesión
        </Link>
      </div>
    </aside>
  )
}