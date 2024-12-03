import { db } from '@/firebase-app-config.js'
import { arrayRemove, arrayUnion, collection, doc, getDoc, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
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
    } catch {
        console.warn('Request body is not set.')
    }

    try {
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
            reviews: [],
            type: 'user'
        }
    } catch {
        console.warn('User data cannot be set.')
    }

    return ({ currentUser, body, newUserdata })
}

export async function POST(req, { params }) {
    const { currentUser, body, newUserdata } = await init(req)

    if (!currentUser) {
        return NextResponse.json({ message: 'User not logged in', authorized: false }, { status: 401 })
    }

    const document = doc(db, 'users', currentUser.uid)
    const userDocRaw = await getDoc(document)
    const userDoc = userDocRaw.data()

    let updated

    try {
        if (params.slug != 'add' && params.slug != 'update' && !userDocRaw.exists()) {
            return NextResponse.json({ message: 'User does not exist', authorized: false }, { status: 404 })
        }

        switch (params.slug) {
            case 'add':
                await setDoc(document, newUserdata)
                break;

            case 'update':
                updated = {
                    ...userDoc,
                    name: {
                        ...newUserdata.name
                    }
                }

                await setDoc(document, updated)
                break;

            case 'verify':
                return NextResponse.json({ ...userDoc, authorized: true }, { status: 200 })

            case 'list':
                if (userDoc.type === 'admin') {
                    const collectionRef = collection(db, 'users')
                    const items = await fetchCollectionItems({
                        collection: collectionRef,
                        orderByKey: body.orderBy,
                        order: body.order,
                        limit: body.limit,
                        firstDoc: body.firstDoc,
                        lastDoc: body.lastDoc,
                        filter: body.search
                    })

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
                    itemsParsed.push({
                        id: items[i].id,
                        name: document.name,
                        description: document.description,
                        price: document.price,
                        imageUrl: document.thmburl.url,
                        quantity: items[i].quantity,
                        type: items[i].type
                    })
                }

                return NextResponse.json(itemsParsed, { status: 200 })

            case 'add-address':
                await updateDoc(document, {
                    locations: arrayUnion({
                        name: body.name,
                        phone: body.phone,
                        active: false,
                        address: {
                            line1: body.address.line1,
                            line2: body.address.line2,
                            city: body.address.city,
                            country: body.address.country,
                            postal_code: body.address.postal_code,
                            state: body.address.state
                        }
                    })
                })
                break

            case 'remove-address':
                await updateDoc(document, {
                    locations: userDoc.locations.filter((_, idx) => idx != body.index)
                })

            case 'get-address':
                return NextResponse.json(userDoc.locations, { status: 200 })

            case 'add-cart':
                await updateDoc(document, {
                    cart: arrayUnion({
                        item: doc(db, 'products', body.id),
                        quantity: body.quantity,
                        type: body.type,
                        id: body.id,
                        type: body.type
                    })
                })
                break

            case 'update-cart':
                updated = { ...userDoc }

                updated.cart.find((item, idx) => {
                    if (item.id === body.id) {
                        updated[idx] = {
                            item: doc(db, 'products', body.id),
                            quantity: body?.quantity ?? item.quantity,
                            type: body?.type ?? item.type,
                            id: item.id
                        }
                        return
                    }
                })

                await setDoc(document, updated)
                break

            case 'remove-cart':
                updated = { ...userDoc, cart: userDoc.cart.filter((item) => item.id != body.id) }
                await setDoc(document, updated)
                break

            default:
                return NextResponse.json({ error: 'Unknown fetch type' }, { status: 501 })
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Wrong request body' }, { status: 500 })
    }

    return NextResponse.json({ message: 'success' }, { status: 200 })
}