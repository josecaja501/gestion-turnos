'use client'

import MobileMenu from './MobileMenu'
import ThemeToggle from './ThemeToggle'

export default function AdminHeader({ 
  esAdmin, 
  userName, 
  userEmail 
}: { 
  esAdmin: boolean
  userName: string
  userEmail: string
}) {
  return (
    <header className="bg-slate-900 dark:bg-gray-800 border-b border-slate-700 dark:border-gray-700 px-4 py-4 flex items-center justify-between md:px-6">
      <div className="flex items-center gap-3">
        <MobileMenu
          esAdmin={esAdmin}
          userName={userName}
          userEmail={userEmail}
        />
        <h2 className="text-lg md:text-xl font-semibold text-white">
          Bienvenido, {userName}
        </h2>
      </div>
      <ThemeToggle />
    </header>
  )
}