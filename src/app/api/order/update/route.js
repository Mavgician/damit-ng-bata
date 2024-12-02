import { db } from '@/firebase-app-config.js'

import { doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { type, id, quantity, is_checkout } = await req.json()

    const order_ref = doc(db, 'orders', id)
    const order = (await getDoc(order_ref)).data()

    const payload = {
      last_modified: Timestamp.now(),
      type: type ?? order.type,
      quantity: quantity ?? order.quantity,
      is_checkout: is_checkout ?? order.is_checkout
    }

    await updateDoc(order_ref, payload)

  } catch (error) {
    console.warn(error)
    return NextResponse.json({ message: 'Internal Server Error', stack: `${error}` }, { status: 500 })
  }

  return NextResponse.json({ message: 'success' }, { status: 200 })
}