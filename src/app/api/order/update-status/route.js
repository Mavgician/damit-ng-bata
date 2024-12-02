import { db } from '@/firebase-app-config.js'

import { doc, Timestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { id, status } = await req.json()
    const document = doc(db, 'orders', id)

    if (status == 'success' || status == 'cancelled' || status == 'pending') {
      let payload = {
        last_modified: Timestamp.now(),
        status,
      }

      await updateDoc(document, payload)
    } else {
      return NextResponse.json({ message: 'Status is not allowed!' }, { status: 401 })
    }

  } catch (error) {
    console.warn(error)
    return NextResponse.json({ message: 'Internal Server Error', stack: `${error}` }, { status: 500 })
  }

  return NextResponse.json({ message: 'success' }, { status: 200 })
}