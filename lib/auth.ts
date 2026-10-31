import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Contraseña', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const usuario = await prisma.usuario.findUnique({
          where: { email: credentials.email as string }
        })

        if (!usuario || !usuario.activo) {
          return null
        }

        // Intenta primero comparar con bcrypt (si está hasheada)
        let esValida = false
        try {
          esValida = await bcrypt.compare(credentials.password as string, usuario.password)
        } catch {
          // Si bcrypt falla, la contraseña probablemente está en texto plano
          esValida = false
        }

        // Si no coincide con bcrypt, prueba comparación directa (texto plano)
        if (!esValida) {
          esValida = usuario.password === credentials.password
        }

        if (!esValida) {
          return null
        }

        return {
          id: usuario.id,
          email: usuario.email,
          nombre: usuario.nombre,
          rol: usuario.rol
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.rol = user.rol
        token.nombre = user.nombre
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.rol = token.rol as string
        session.user.nombre = token.nombre as string
      }
      return session
    }
  },
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: 'jwt'
  }
})