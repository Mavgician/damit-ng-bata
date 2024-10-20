import { db, auth } from '@/firebase-app-config.js'
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { NextResponse } from 'next/server';

import { getUserSS } from "firebase-nextjs/server/auth";

export async function POST(req, { params }) {
    const url = req.nextUrl.searchParams
    const currentUser = await getUserSS()

    console.log(currentUser);

    if (!currentUser) {
        return NextResponse.json({ error: 'User not logged in' }, { status: 401 })
    }

    const document = doc(db, 'users', currentUser.uid)
    const userDocRaw = await getDoc(document)
    const userDoc = userDocRaw.data()

    const display_name = url.get('dname')
    const first_name = url.get('fname')
    const last_name = url.get('lname')

    const payload = {
        creation: Timestamp.now(),
        email: currentUser.email,
        locations: [],
        name: {
            display: display_name,
            first: first_name,
            last: last_name
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
                    display: display_name,
                    first: first_name,
                    last: last_name
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