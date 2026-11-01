'use client'

import { useEffect, useState } from 'react'
import Logo from './Logo'

interface GoodbyeScreenProps {
  userName: string
  userRole: string
  onComplete: () => void
}

export default function GoodbyeScreen({ userName, userRole, onComplete }: GoodbyeScreenProps) {
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Iniciar la despedida a los 2.5 segundos
    const timer = setTimeout(() => {
      setFadeOut(true)
    }, 2500)

    // Ejecutar la acción de cierre y redirección a los 3 segundos
    const actionTimer = setTimeout(() => {
      onComplete()
    }, 3000)

    return () => {
      clearTimeout(timer)
      clearTimeout(actionTimer)
    }
  }, [onComplete])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Que tengas un buen día'
    if (hour < 20) return 'Que tengas buenas tardes'
    return 'Que descanses'
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-purple-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
      </div>

      <div className="relative text-center px-8">
        <div className="mb-6 flex justify-center">
          <Logo size="large" showText={false} />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
          Hasta pronto, {userName}
        </h1>
        
        <p className="text-xl text-blue-200 mb-8">
          {getGreeting()}
        </p>

        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-6 py-3 rounded-full border border-white/20">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <span className="text-white text-sm">
            Sesión de <strong>{userRole}</strong> cerrando...
          </span>
        </div>

        <div className="mt-8 flex justify-center gap-1">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  )
}