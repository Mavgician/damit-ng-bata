import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'

import FirebaseNextJSMiddleware from 'firebase-nextjs/middleware/firebase-nextjs-middleware';
import checkUser from 'firebase-nextjs/middleware/check-user'

const options = {
    allowRule: "^\/(home|products(\/[^\/]+(\/item\/[^\/]+)?)?|login|register|about-us|forgot-password|_next\/.*)?$"
}

const AUTH_PATHS = [
    "/login",
    "/register",
    "/forgot-password",
    "/admin-dashboard"
]

export default async function middleware(req) {
    const path = req.nextUrl.pathname;
    const loggedIn = await checkUser();

    const rule = new RegExp(options.allowRule)

    // If user is already logged in, and tries an auth page
    // Redirect to the target page
    if (loggedIn && AUTH_PATHS.includes(path)) {
        const cookieStore = cookies()
        const token = cookieStore.get('firebase_nextjs_token')

        const target = req.nextUrl.searchParams.get('target') ?? "/";
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

        if (verifyUser.status === 404) {
            return NextResponse.redirect(new URL('/account-setup', req.nextUrl));
        }

        if (path.split('/').includes('admin-dashboard') && await verifyUser.json().type !== 'admin') {
            return NextResponse.redirect(new URL('/not-allowed', req.nextUrl));
        }

        return NextResponse.redirect(new URL(target, req.nextUrl));
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

    if (loggedIn) {
        return NextResponse.next()
    }

    return NextResponse.redirect(new URL('/login?target=' + path, req.nextUrl));
}