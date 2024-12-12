import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'

import { fetchParsed } from '@/lib/fetch-parsed'

import checkUser from 'firebase-nextjs/middleware/check-user'

const options = {
    allowRule: "^\/(home|products(\/[^\/]+(\/item\/[^\/]+)?)?|login|register|about-us|forgot-password|_next\/.*)?$"
}

const AUTH_PATHS = [
    "/login",
    "/register",
    "/forgot-password",
]

const ADMIN_PATHS = [
    "/admin-dashboard"
]

const rule = new RegExp(options.allowRule)

export const config = {
    matcher: [
        '/login:path*',
        '/admin-dashboard:path*',
        '/cart:path*',
        '/profile:path*',
        '/register/:path*',
        '/checkout:path*',
        '/checkout-success:path*',
    ],
}

export default async function middleware(req) {
    const path = req.nextUrl.pathname;
    const loggedIn = await checkUser();

    console.info('current path: ' + path);
    
    if (path.split('/').includes('api')) {
        return NextResponse.next()
    }
    
    // Check if authenticated user has the correct roles.
    if (loggedIn) {
        const target = req.nextUrl.searchParams.get('target') ?? "/"

        const cookieStore = cookies()
        const token = cookieStore.get('firebase_nextjs_token')
        const user = await fetchParsed(
            req.nextUrl.origin + '/api/user/verify',
            {
                method: 'POST',
                body: JSON.stringify({
                    token: token.value
                })
            }
        )

        if (user.isDisabled) {
            return NextResponse.redirect(new URL('/account-disabled', req.nextUrl))
        }

        const isAdmin = user?.type == 'admin'
        console.info('User is admin: ' + isAdmin)
        
        if (user?.type == undefined) {
            return NextResponse.redirect(new URL('/account-setup', req.nextUrl));
        }

        if (path != '/admin-dashboard' && isAdmin) {
            return NextResponse.redirect(new URL('/admin-dashboard', req.nextUrl))
        }

        if (AUTH_PATHS.includes(path)) {
            return NextResponse.redirect(new URL(target, req.nextUrl));
        }

        if (ADMIN_PATHS.includes(path) && !isAdmin) {
            return NextResponse.redirect(new URL('/not-allowed', req.nextUrl))
        }

        return NextResponse.next()
    }

    if (AUTH_PATHS.includes(path)) {
        return NextResponse.next()
    }

    if (rule.test(path)) {
        return NextResponse.next()
    }

    return NextResponse.redirect(new URL('/login?target=' + path, req.nextUrl));
}