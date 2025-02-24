import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/app/auth'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const session = await auth()
  
  // Se estiver autenticado e tentar acessar /login, redireciona para /dashboard/imports
  if (session && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard/imports', request.url))
  }

  // Se não estiver autenticado e tentar acessar /dashboard, redireciona para /login
  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// Configura em quais rotas o middleware será executado
export const config = {
  matcher: ['/dashboard/:path*', '/login']
}