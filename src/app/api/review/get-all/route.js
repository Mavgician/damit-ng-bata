import { db } from '@/firebase-app-config.js'

import { getUserSS } from "firebase-nextjs/server/auth"

import { collection, doc, getDoc } from "firebase/firestore"

import { NextResponse } from 'next/server'
import { fetchCollectionItems } from '../../fetch_functions'

export async function GET() {
  try {
    const { uid } = await getUserSS()

    const user = doc(db, 'users', uid)
    const user_data = (await getDoc(user)).data()

    let reviews = []

    for (let i = 0; i < user_data.reviews.length; i++) {
      const review = await getDoc(user_data.reviews[i])
      const review_data = review.data()

      const product_ref = await getDoc(review_data.product_ref)
      const customer_ref = await getDoc(review_data.customer_ref)

      const payload = {
        ...review.data(),
        id: review.id,
        product_ref: {
          data: product_ref.data(),
          id: product_ref.id
        },
        customer_ref: {
          data: customer_ref.data(),
          id: customer_ref.id
        }
      }

      reviews.push(payload)
    }

    return NextResponse.json({ data: reviews, count: reviews.length }, { status: 200 })

  } catch (error) {
    console.warn(error)
    return NextResponse.json({ message: 'Internal Server Error', stack: `${error}` }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const { id } = await req.json()

    const items = await fetchCollectionItems({
      collection: collection(db, 'reviews'),
      filter: [{
        field: 'product_ref',
        operator: '==',
        searchterm: doc(db, 'products', id)
      }]
    })

    let reviews = []

    for (let i = 0; i < items.data.length; i++) {
      const product_ref = await getDoc(items.data[i].product_ref)
      const customer_ref = await getDoc(items.data[i].customer_ref)

      const payload = {
        ...items.data[i],
        product_ref: {
          data: product_ref.data(),
          id: product_ref.id
        },
        customer_ref: {
          data: customer_ref.data(),
          id: customer_ref.id
        }
      }

      reviews.push(payload)
    }

    return NextResponse.json({ data: reviews, count: reviews.length }, { status: 200 })

  } catch (error) {
    console.warn(error)
    return NextResponse.json({ message: 'Internal Server Error', stack: `${error}` }, { status: 500 })
  }
}