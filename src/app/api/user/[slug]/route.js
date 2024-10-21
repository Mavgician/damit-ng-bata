import { db } from '@/firebase-app-config.js'
import { collection, doc, endBefore, getDoc, getDocs, limit, orderBy, query, setDoc, startAfter, Timestamp } from 'firebase/firestore';
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
    } catch {
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

    try {
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

            case 'list':
                if (userDoc.type === 'admin') {
                    let data = []
                    let queryRef

                    const collectionRef = collection(db, 'users')

                    if (body.firstDoc) {
                        queryRef = query(collectionRef, orderBy(body.order), limit(body.limit), endBefore(body.firstDoc))
                    } else if (body.lastDoc) {
                        queryRef = query(collectionRef, orderBy(body.order), limit(body.limit), startAfter(body.lastDoc))
                    } else {
                        queryRef = query(collectionRef, orderBy(body.order), limit(body.limit))
                    }

                    const snapshot = await getDocs(queryRef)

                    for (let i = 0; i < snapshot.docs.length; i++) {
                        data.push(snapshot.docs[i].data())
                    }

                    return NextResponse.json({ ...data }, { status: 200 })
                } else if (userDoc.type !== 'admin') {
                    return NextResponse.json({ error: 'Cannot fetch user list. User lacks authorization.' }, { status: 401 })
                }

                break;

            default:
                return NextResponse.json({ error: 'Unknown fetch type' }, { status: 501 })
        }
    } catch {
        return NextResponse.json({ error: 'Wrong request body' }, { status: 500 })
    }

    return NextResponse.json({ message: 'success' }, { status: 200 })
}