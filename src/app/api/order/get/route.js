import { db } from '@/firebase-app-config.js'

import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { id } = await req.json()
    const doc_ref = await getDoc(doc(db, 'orders', id))
    const document = doc_ref.data()

    const customer = await getDoc(document.customer_ref)
    const product = await getDoc(document.product_ref)

    document.customer_ref = {
      data: customer.data(),
      id: customer.id
    }
    document.product_ref = {
      data: product.data(),
      id: product.id
    }

    return NextResponse.json({ ...document, id: doc_ref.id }, { status: 200 })

  } catch (error) {
    console.warn(error)
    return NextResponse.json({ message: 'Internal Server Error', stack: `${error}` }, { status: 500 })
  }
}