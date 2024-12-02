import { db } from '@/firebase-app-config.js'

import { doc, Timestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { payment_mode, amount, id } = await req.json()
    const document = doc(db, 'orders', id)

    if (!payment_mode || !amount) {
      return NextResponse.json({ message: 'There is something wrong with the body.' }, { status: 401 })
    }

    const payload = {
      last_modified: Timestamp.now(),
      is_payed: true,
      payment_mode,
      status: 'success'
    }

    await updateDoc(document, payload)

  } catch (error) {
    console.warn(error)
    return NextResponse.json({ message: 'Internal Server Error', stack: `${error}` }, { status: 500 })
  }

  return NextResponse.json({ message: 'success' }, { status: 200 })
}