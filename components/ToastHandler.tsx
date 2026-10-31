'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'

export default function ToastHandler() {
  const searchParams = useSearchParams()
  const toastType = searchParams.get('toast')

  useEffect(() => {
    if (toastType === 'deleted') {
      toast.success('🗑️ Eliminado correctamente')
    } else if (toastType === 'created') {
      toast.success('✅ Creado correctamente')
    } else if (toastType === 'updated') {
      toast.success('✏️ Actualizado correctamente')
    } else if (toastType === 'error') {
      toast.error('❌ Ha ocurrido un error')
    }
  }, [toastType])

  return null
}