import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getRoleHome, isApprovalStatus, isUserRole, type ApprovalStatus, type UserRole } from '@/lib/auth-routes'

const adminRoutes = ['/dashboard', '/pets', '/consultas', '/vacinacao', '/historico', '/financeiro', '/agenda']
const tutorRoutes = ['/tutor']
const veterinarioRoutes = ['/veterinario']
const protectedRoutes = [...adminRoutes, ...tutorRoutes, ...veterinarioRoutes]
const authRoutes = ['/login', '/registro']
const approvalRoutes = ['/aguardando-aprovacao']

function matchesRoute(pathname: string, routes: string[]) {
  return routes.some((route) => pathname === route || pathname.startsWith(route + '/'))
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Do NOT add logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard
  // to debug issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  const isProtectedRoute = matchesRoute(pathname, protectedRoutes)
  const isAuthRoute = matchesRoute(pathname, authRoutes)
  const isApprovalRoute = matchesRoute(pathname, approvalRoutes)

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  if ((isAuthRoute || isApprovalRoute) && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role,approval_status')
      .eq('id', user.id)
      .single()

    const approvalStatus: ApprovalStatus = isApprovalStatus(profile?.approval_status)
      ? profile.approval_status
      : 'pending'

    if (approvalStatus === 'pending') {
      if (!isApprovalRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/aguardando-aprovacao'
        return NextResponse.redirect(url)
      }
      return supabaseResponse
    }

    if (approvalStatus === 'rejected') {
      if (isAuthRoute) return supabaseResponse
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('approval', 'rejected')
      return NextResponse.redirect(url)
    }

    const url = request.nextUrl.clone()
    url.pathname = getRoleHome(isUserRole(profile?.role) ? profile.role : null)
    return NextResponse.redirect(url)
  }

  if (isProtectedRoute && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role,approval_status')
      .eq('id', user.id)
      .single()

    const approvalStatus: ApprovalStatus = isApprovalStatus(profile?.approval_status)
      ? profile.approval_status
      : 'pending'

    if (approvalStatus === 'pending') {
      const url = request.nextUrl.clone()
      url.pathname = '/aguardando-aprovacao'
      return NextResponse.redirect(url)
    }

    if (approvalStatus === 'rejected') {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('approval', 'rejected')
      return NextResponse.redirect(url)
    }

    const role: UserRole = isUserRole(profile?.role) ? profile.role : 'tutor'
    const isAllowed =
      (matchesRoute(pathname, adminRoutes) && role === 'admin') ||
      (matchesRoute(pathname, tutorRoutes) && role === 'tutor') ||
      (matchesRoute(pathname, veterinarioRoutes) && role === 'veterinario')

    if (!isAllowed) {
      const url = request.nextUrl.clone()
      url.pathname = getRoleHome(role)
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
