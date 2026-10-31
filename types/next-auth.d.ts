import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      nombre: string
      email: string
      rol: string
    }
  }

  interface User {
    id: string
    nombre: string
    email: string
    rol: string
  }
}