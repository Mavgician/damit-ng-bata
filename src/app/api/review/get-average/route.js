import { db } from '@/firebase-app-config.js'

import { average, collection, doc, getAggregateFromServer, query, where } from "firebase/firestore"

import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { id } = await req.json()

    const q = query(collection(db, 'reviews'), where('product_ref', '==', doc(db, 'products', id)))
    const avg_rating = await getAggregateFromServer(q, {rating: average('rating')})

    

    return NextResponse.json({ average: avg_rating.data().rating ?? 0 }, { status: 200 })

  } catch (error) {
    console.warn(error)
    return NextResponse.json({ message: 'Internal Server Error', stack: `${error}` }, { status: 500 })
  }
}