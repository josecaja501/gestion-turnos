'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import GoodbyeScreen from '@/components/GoodbyeScreen'

export default function CerrarSesionPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<{ name: string; role: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Obtener los datos del usuario antes de cerrar sesión
    const fetchSession = async () => {
      try {
        const res = await fetch('/api/auth/session')
        const session = await res.json()
        
        if (session?.user) {
          setUserData({
            name: session.user.nombre || session.user.email || 'Usuario',
            role: session.user.rol === 'ADMINISTRADOR' ? 'Administrador' : 'Técnico'
          })
        } else {
          // Si no hay sesión, redirigir directamente al login
          router.push('/login')
        }
      } catch (err) {
        console.error("Error obteniendo sesión", err)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchSession()
  }, [router])

  const handleSignOutAndRedirect = async () => {
    await signOut({ redirect: false })
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-blue-200">Preparando despedida...</p>
        </div>
      </div>
    )
  }

  if (userData) {
    return (
      <GoodbyeScreen 
        userName={userData.name} 
        userRole={userData.role} 
        onComplete={handleSignOutAndRedirect} 
      />
    )
  }

  return null
}