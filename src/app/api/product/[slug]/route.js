import { db } from '@/firebase-app-config.js'
import { addDoc, collection, doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { NextResponse } from 'next/server';

import { fetchCollectionItems } from '@/api/fetch_functions'

export async function POST(req, { params }) {
  const collectionRef = collection(db, 'products')

  let body, newProductData

  try {
    body = await req.json()

    newProductData = {
      carouselurls: [...body.carouselurls],
      description: body.description,
      is_available: body.is_available,
      name: body.name,
      price: body.price,
      tags: [...body.tags],
      thmburl: body.thumbnail,
      type: [...body.type],
    }
  } catch {
    console.warn('Request body is not set.')
  }

  try {
    switch (params.slug) {
      case 'add':
        await addDoc(collectionRef, {...newProductData, creation: Timestamp.now(), last_modified: Timestamp.now()})
        break

      case 'update':
        await setDoc(doc(collectionRef, body.productID), {...newProductData, last_modified: Timestamp.now()})
        break

      case 'list':
        const items = await fetchCollectionItems(collectionRef, body.order, body.limit, body.firstDoc, body.lastDoc)

        return NextResponse.json(items, { status: 200 })

      case 'item':
        const document = doc(collectionRef, body.productID)
        const product = (await getDoc(document)).data()

        return NextResponse.json({ ...product }, { status: 200 })

      default:
        return NextResponse.json({ error: 'Unknown fetch type' }, { status: 501 })
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Wrong request body' }, { status: 500 })
  }

  return NextResponse.json({ message: 'success' }, { status: 200 })
}