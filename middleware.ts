import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // Ignora requisições para /dashboard/list-all para evitar loop
  if (request.nextUrl.pathname === '/dashboard/list-imports') {
    return NextResponse.next()
  }

  try {
    // Tenta fazer uma requisição para a API ou rota específica
    const res = await fetch(request.url, {
      headers: {
        'x-middleware-bypass': 'true' // Marca para evitar loop
      }
    })
    
    // Se a página existe (status 200), deixa passar
    if (res.status === 200) {
      return NextResponse.next()
    }
    
    // Se chegou aqui, a página não existe, então redireciona
    return NextResponse.redirect(new URL('/dashboard/list-imports', request.url))
  } catch {
    // Se der algum erro, redireciona também
    return NextResponse.redirect(new URL('/dashboard/list-imports', request.url))
  }
}

// Remove o matcher para que o middleware rode em todas as rotas