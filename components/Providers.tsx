'use client'

import { ThemeProvider } from './ThemeProvider'
import { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      {children}
      {/* Contenedor global de notificaciones */}
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#334155',
            color: '#fff',
            borderRadius: '8px',
          },
        }} 
      />
    </ThemeProvider>
  )
}