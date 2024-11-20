import { db } from '@/firebase-app-config.js'
import { collection, doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { NextResponse } from 'next/server';

import { fetchCollectionItems } from '@/api/fetch_functions'

import { getAppSS, getUserSS } from "firebase-nextjs/server/auth";
import { getAuth } from 'firebase-admin/auth';

async function init(req) {
    const app = await getAppSS()

    let currentUser = await getUserSS()
    let body, newUserdata

    try {
        body = await req.json()
        currentUser = currentUser ?? await getAuth(app).verifySessionCookie(body?.token)

        newUserdata = {
            creation: Timestamp.now(),
            last_modified: Timestamp.now(),
            email: currentUser.email,
            locations: [],
            name: {
                display: body?.display_name ?? null,
                first: body?.first_name ?? null,
                last: body?.last_name ?? null
            },
            orders: [],
            ratings: [],
            cart: [],
            type: 'user'
        }

    } catch {
        console.warn('Request body is not set.')
    }

    return ({currentUser, body, newUserdata})
}

export async function POST(req, { params }) {
    const { currentUser, body, newUserdata } = await init(req)

    if (!currentUser) {
        return NextResponse.json({ error: 'User not logged in' }, { status: 401 })
    }

    const document = doc(db, 'users', currentUser.uid)
    const userDocRaw = await getDoc(document)
    const userDoc = userDocRaw.data()
    
    try {
        switch (params.slug) {
            case 'add':
                await setDoc(document, newUserdata)
                break;

            case 'update':
                const updated = {
                    ...userDoc,
                    name: {
                        ...newUserdata.name
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
                    const collectionRef = collection(db, 'users')
                    const items = await fetchCollectionItems(collectionRef, body.order, body.limit, body.firstDoc, body.lastDoc)

                    return NextResponse.json(items, { status: 200 })
                } else if (userDoc.type !== 'admin') {
                    return NextResponse.json({ error: 'Cannot fetch user list. User lacks permission.' }, { status: 401 })
                } else {
                    return NextResponse.json({ error: 'User not logged in.' }, { status: 401 })
                }

            case 'cart':
                const collectionRef = collection(db, 'products')
                const items = userDoc.cart
                let itemsParsed = []

                for (let i = 0; i < items.length; i++) {
                    const document = (await getDoc(doc(collectionRef, items[i].item.id))).data()
                    itemsParsed.push({ item: document, quantity: items[i].quantity })
                }

                return NextResponse.json(itemsParsed, { status: 200 })

            default:
                return NextResponse.json({ error: 'Unknown fetch type' }, { status: 501 })
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Wrong request body' }, { status: 500 })
    }

    return NextResponse.json({ message: 'success' }, { status: 200 })
}