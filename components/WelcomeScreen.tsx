'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Logo from './Logo'

interface WelcomeScreenProps {
  userName: string
  userRole: string
}

export default function WelcomeScreen({ userName, userRole }: WelcomeScreenProps) {
  const [fadeOut, setFadeOut] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true)
    }, 2500)

    const redirectTimer = setTimeout(() => {
      router.push('/admin')
    }, 3000)

    return () => {
      clearTimeout(timer)
      clearTimeout(redirectTimer)
    }
  }, [router])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Buenos días'
    if (hour < 20) return 'Buenas tardes'
    return 'Buenas noches'
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
          {getGreeting()}, {userName}
        </h1>
        
        <p className="text-xl text-blue-200 mb-8">
          Bienvenido a Gestión Turnos
        </p>

        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-6 py-3 rounded-full border border-white/20">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-white text-sm">
            Sesión iniciada como <strong>{userRole}</strong>
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