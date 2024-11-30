import { db } from '@/firebase-app-config.js'

import { getUserSS } from "firebase-nextjs/server/auth";

import { doc } from "firebase/firestore";
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const currentUser = await getUserSS()
    const data = await req.json()
    
    const payload = {
      creation: Timestamp.now(),
      customer_ref: doc(db, 'users', currentUser.uid),
      product_ref: doc(db, 'products', data.product_id),
      payment_amount: data.amount,
      payment_mode: data.mode,
      quantity: data.quantity,
      type: data.type,
      unit_amount: data.unit_amount,
      stripe_id: data.stripe_id
    }

    console.log(payload)

  } catch (error) {
    console.warn(error)
  }

  return NextResponse.json({ message: 'success' }, { status: 200 })
}