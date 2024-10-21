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

export default async function middleware(req) {
    const path = req.nextUrl.pathname;
    const loggedIn = await checkUser();

    const rule = new RegExp(options.allowRule)

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

        const isAdmin = ADMIN_PATHS.includes(path) && (await verifyUser.json()).type === 'admin'

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

    if (path.split('/').includes('api')) {
        return NextResponse.next()
    }

    // Requesting an auth page.
    // These are special routes handled by FirebaseNextJS au1th.
    if (AUTH_PATHS.includes(path)) {
        return NextResponse.next()
    }

    // If a regex rule is defined in allowRule, allow the path if it matches
    // Every other form of rule specification is ignored.
    if (rule.test(path)) {
        return NextResponse.next()
    }

    return NextResponse.redirect(new URL('/login?target=' + path, req.nextUrl));
}