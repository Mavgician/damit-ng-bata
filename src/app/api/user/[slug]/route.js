import { db } from '@/firebase-app-config.js'
import { collection, doc, endBefore, getCountFromServer, getDoc, getDocs, limit, orderBy, query, setDoc, startAfter, Timestamp } from 'firebase/firestore';
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
                    let data = [], ids = []
                    let queryRef

                    const collectionRef = collection(db, 'users')
                    const initQuery = query(collectionRef, orderBy(body.order), limit(body.limit))

                    const totalCount = await getCountFromServer(collectionRef)

                    if (body.firstDoc) {
                        const cursor = await getDoc(doc(db, 'users', body.firstDoc))
                        queryRef = query(initQuery, endBefore(cursor))
                    } else if (body.lastDoc) {
                        const cursor = await getDoc(doc(db, 'users', body.lastDoc))
                        queryRef = query(initQuery, startAfter(cursor))
                    } else {
                        queryRef = initQuery
                    }

                    const snapshot = await getDocs(queryRef)

                    for (let i = 0; i < snapshot.docs.length; i++) {
                        data.push(snapshot.docs[i].data())
                        ids.push(snapshot.docs[i].id)
                    }

                    return NextResponse.json({ data, docs: ids, count: totalCount.data().count }, { status: 200 })
                } else if (userDoc.type !== 'admin') {
                    return NextResponse.json({ error: 'Cannot fetch user list. User lacks authorization.' }, { status: 401 })
                }

                break;

            default:
                return NextResponse.json({ error: 'Unknown fetch type' }, { status: 501 })
        }
    } catch (error) {
        console.log(error);

        return NextResponse.json({ error: 'Wrong request body' }, { status: 500 })
    }

    return NextResponse.json({ message: 'success' }, { status: 200 })
}