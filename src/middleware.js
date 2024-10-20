import { NextResponse } from 'next/server';

import FirebaseNextJSMiddleware from 'firebase-nextjs/middleware/firebase-nextjs-middleware';
import checkUser from 'firebase-nextjs/middleware/check-user'

const options = {
    allowRule: "^\/(home|products(\/[^\/]+(\/item\/[^\/]+)?)?|login|register|about-us|forgot-password|_next\/.*)?$"
}

const AUTH_PATHS = [
    "/login",
    "/register",
    "/forgot-password"
]

export default async function middleware(req) {
    const path = req.nextUrl.pathname;
    const loggedIn = await checkUser();

    const rule = new RegExp(options.allowRule)

    // If user is already logged in, and tries an auth page
    // Redirect to the target page
    if (loggedIn && AUTH_PATHS.includes(path)) {
        const target = req.nextUrl.searchParams.get('target') ?? "/";
        const checkUserFirestore = await fetch(
            new URL('/api/user/verify', req.nextUrl),
            {
                method: 'POST',
                body: JSON.stringify({
                    isLogin: true
                })
            }
        )

        if (checkUserFirestore.status === 404) {
            return NextResponse.redirect(new URL('/account-setup', req.nextUrl));
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