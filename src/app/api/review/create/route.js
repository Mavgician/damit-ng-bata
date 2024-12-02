import { db } from '@/firebase-app-config.js'

import { getUserSS } from "firebase-nextjs/server/auth"

import { addDoc, arrayUnion, collection, doc, Timestamp, updateDoc } from "firebase/firestore"

import { NextResponse } from 'next/server'

export async function POST(req) {
  const ip = (req.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0]

  try {
    const { uid } = await getUserSS()
    const { product_id, rating, review } = await req.json()

    const user = doc(db, 'users', uid)
    const product = doc(db, 'products', product_id)

    const payload = {
      creation: Timestamp.now(),
      customer_ref: user,
      product_ref: product,
      rating: rating,
      text: review,
      ip_addr: ip
    }

    const review_ref = await addDoc(collection(db, 'reviews'), payload)

    await updateDoc(user, {
      reviews: arrayUnion(review_ref)
    })

    return NextResponse.json({ id: review_ref.id }, { status: 200 })

  } catch (error) {
    console.warn(error)
    return NextResponse.json({ message: 'Internal Server Error', stack: `${error}` }, { status: 500 })
  }
}