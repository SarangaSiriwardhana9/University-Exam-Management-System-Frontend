import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const middleware = (request: NextRequest) => {
  const token = request.cookies.get('auth_token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '')

  const { pathname } = request.nextUrl

  const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  if (!isPublicRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isPublicRoute && token && pathname !== '/') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}