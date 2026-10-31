'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface MobileMenuProps {
  esAdmin: boolean
  userName: string
  userEmail: string
}

export default function MobileMenu({ esAdmin, userName, userEmail }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin'
    }
    return pathname === path || pathname.startsWith(path + '/')
  }

  const linkClass = (path: string) => {
    const base = 'flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors'
    if (isActive(path)) {
      return `${base} bg-blue-600 text-white`
    }
    return `${base} text-slate-200 hover:bg-slate-800`
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white shadow-md active:scale-95 transition-all"
        aria-label="Abrir menú"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-60"
            onClick={() => setIsOpen(false)}
          ></div>

          <div className="absolute left-0 top-0 h-full w-72 bg-slate-900 text-white flex flex-col shadow-2xl">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold">Gestión Turnos</h1>
                <p className="text-xs text-slate-400 mt-1">
                  {esAdmin ? 'Panel Admin' : 'Panel Operario'}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-300"
                aria-label="Cerrar menú"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-4 bg-slate-800 border-b border-slate-700">
              <p className="text-sm font-semibold text-white">{userName}</p>
              <p className="text-xs text-slate-400">{userEmail}</p>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {esAdmin && (
                <Link href="/admin" className={linkClass('/admin')} onClick={() => setIsOpen(false)}>
                  <span>📊</span> Dashboard
                </Link>
              )}
              <Link href="/admin/novedades" className={linkClass('/admin/novedades')} onClick={() => setIsOpen(false)}>
                <span>📝</span> Novedades
              </Link>
              {esAdmin && (
                <>
                  <Link href="/admin/usuarios" className={linkClass('/admin/usuarios')} onClick={() => setIsOpen(false)}>
                    <span>👥</span> Usuarios
                  </Link>
                  <Link href="/admin/informes" className={linkClass('/admin/informes')} onClick={() => setIsOpen(false)}>
                    <span>📄</span> Informes
                  </Link>
                </>
              )}
              <Link href="/admin/tareas" className={linkClass('/admin/tareas')} onClick={() => setIsOpen(false)}>
                <span>✅</span> Tareas
              </Link>
              <Link href="/admin/perfil" className={linkClass('/admin/perfil')} onClick={() => setIsOpen(false)}>
                <span>👤</span> Mi Perfil
              </Link>
            </nav>

            <div className="p-4 border-t border-slate-700">
              <Link
                href="/api/auth/signout"
                className="flex items-center justify-center gap-2 px-4 py-3 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium"
              >
                <span>🚪</span> Cerrar sesión
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}