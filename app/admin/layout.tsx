import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import AdminHeader from '@/components/AdminHeader'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  const esAdmin = session.user?.rol === 'ADMINISTRADOR'

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar
        esAdmin={esAdmin}
        userName={session.user.nombre}
        userEmail={session.user.email}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader
          esAdmin={esAdmin}
          userName={session.user.nombre}
          userEmail={session.user.email}
        />

        <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}