import { db } from '@/firebase-app-config.js'
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { NextResponse } from 'next/server';

import { getAppSS, getUserSS } from "firebase-nextjs/server/auth";
import { getAuth } from 'firebase-admin/auth';

export async function POST(req, { params }) {
    const app = await getAppSS()

    let currentUser = await getUserSS()
    let body

    try {
        body = await req.json()
        currentUser = await getAuth(app).verifySessionCookie(body?.token)
    } catch () {
        console.warn('Request body is not set.')
    }

    if (!currentUser) {
        return NextResponse.json({ error: 'User not logged in' }, { status: 401 })
    }

    const document = doc(db, 'users', currentUser.uid)
    const userDocRaw = await getDoc(document)
    const userDoc = userDocRaw.data()

    const payload = {
        creation: Timestamp.now(),
        email: currentUser.email,
        locations: [],
        name: {
            display: body?.display_name ?? null,
            first: body?.first_name ?? null,
            last: body?.last_name ?? null
        },
        orders: [],
        ratings: [],
        type: 'user'
    }

    switch (params.slug) {
        case 'new':
            await setDoc(document, payload)
            break;

        case 'update':
            const updated = {
                ...userDoc,
                name: {
                    ...payload.name
                }
            }

            await setDoc(document, updated)
            break;

        case 'verify':
            if (userDocRaw.exists()) {
                return NextResponse.json({ ...userDoc }, { status: 200 })
            } else {
                return NextResponse.json({ message: 'User does not exist' }, { status: 404 })
            }

        default:
            return NextResponse.json({ error: 'Unknown fetch type' }, { status: 501 })
    }

    return NextResponse.json({ message: 'success' }, { status: 200 })
}