import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null
        
        // Valida as credenciais com as variáveis de ambiente
        if (
          credentials.username === process.env.AUTH_USERNAME &&
          credentials.password === process.env.AUTH_PASSWORD
        ) {
          return {
            id: "1",
            name: credentials.username as string,
          }
        }
        
        return null
      }
    })
  ],
  pages: {
    signIn: "/login", // Página de login personalizada (opcional)
  }
})