export { default } from 'next-auth/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { getSession } from 'next-auth/react'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
	// const isLoggedIn = !!req.cookies.has('next-auth.session-token')
	// const session = await getSession({ req: req as any })
	// const isLoggedIn = await !!session
	const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
	const isLoggedIn = !!token

	if (req.nextUrl.pathname.startsWith('/login')) {
		if (isLoggedIn) {
			return NextResponse.redirect(new URL('/', req.url))
		}
	}

	if (req.nextUrl.pathname.startsWith('/profile')) {
		console.log('isLoggedIn', isLoggedIn)
		if (!isLoggedIn) {
			return NextResponse.redirect(new URL('/login', req.url))
		}
	}
}
export const config = {
	matcher: ['/login', '/profile'],
}
