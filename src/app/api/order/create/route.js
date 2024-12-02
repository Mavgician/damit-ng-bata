import { db } from '@/firebase-app-config.js'

import { getUserSS } from "firebase-nextjs/server/auth";

import { addDoc, arrayUnion, collection, doc, getDoc, increment, Timestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { uid } = await getUserSS()
    const { product_id, quantity, type, amount, is_checkout, is_buying } = await req.json()

    const user = doc(db, 'users', uid)
    const userData = (await getDoc(user)).data()

    let isExisting = false, order_ref = null

    if (!product_id || !quantity || !type || !amount) {
      return NextResponse.json({ message: 'There is something wrong with the body.' }, { status: 401 })
    }

    for (let i = 0; i < userData.orders.length; i++) {
      const user_order_ref = userData.orders[i]
      const user_order_data = (await getDoc(user_order_ref)).data()
      const order_product_id = user_order_data.product_ref.id

      if (is_buying) {
        break
      }

      if (order_product_id == product_id) {
        isExisting = true
        order_ref = user_order_ref
        break
      }
    }

    const payload = {
      creation: Timestamp.now(),
      last_modified: Timestamp.now(),
      customer_ref: doc(db, 'users', uid),
      product_ref: doc(db, 'products', product_id),
      payment_mode: 'n/a',
      quantity: quantity,
      type: type,
      is_payed: false,
      is_checkout: is_checkout ?? false,
      amount: amount,
      status: 'pending'
    }

    if (isExisting) {
      if (is_checkout) {
        await updateDoc(order_ref, { quantity: quantity })
      } else {
        await updateDoc(order_ref, { quantity: increment(quantity) })
      }
    } else {
      const order = await addDoc(collection(db, 'orders'), payload)

      order_ref = order

      await updateDoc(user, {
        orders: arrayUnion(order)
      })
    }

    return NextResponse.json({ id: order_ref.id }, { status: 200 })

  } catch (error) {
    console.warn(error)
    return NextResponse.json({ message: 'Internal Server Error', stack: `${error}` }, { status: 500 })
  }
}