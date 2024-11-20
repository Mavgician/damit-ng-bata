import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'

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

export default async function middleware(req) {
    const path = req.nextUrl.pathname;
    const loggedIn = await checkUser();

    console.log('current path: ' + path);
    

    if (path.split('/').includes('api')) {
        return NextResponse.next()
    }

    // Check if authenticated user has the correct roles.
    if (loggedIn) {
        const target = req.nextUrl.searchParams.get('target') ?? "/"
    
        const cookieStore = cookies()
        const token = cookieStore.get('firebase_nextjs_token')
        const verifyUser = await fetch(
            new URL('/api/user/verify', req.nextUrl),
            {
                method: 'POST',
                body: JSON.stringify({
                    isLogin: true,
                    token: token.value
                })
            }
        )
        const user = await verifyUser.json()
        const isAdmin = ADMIN_PATHS.includes(path) && user?.type == 'admin'

        if (AUTH_PATHS.includes(path) && verifyUser.status == 404) {
            return NextResponse.redirect(new URL('/account-setup', req.nextUrl));
        }

        if (AUTH_PATHS.includes(path)) {
            return NextResponse.redirect(new URL(target, req.nextUrl));
        }

        if (ADMIN_PATHS.includes(path) && isAdmin) {
            return NextResponse.next()
        } else if (ADMIN_PATHS.includes(path) && !isAdmin) {
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

export const config = {
    matcher: ['/login:path*', '/admin:path*', '/cart:path*', '/profile:path*'],
};