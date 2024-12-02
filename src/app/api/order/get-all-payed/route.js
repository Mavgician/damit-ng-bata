import { db } from '@/firebase-app-config.js'
import { getUserSS } from 'firebase-nextjs/server/auth';

import { collection, doc, getDoc } from "firebase/firestore";
import { NextResponse } from 'next/server';

import { fetchCollectionItems } from '../../fetch_functions'

export async function GET() {
  try {
    const { uid } = await getUserSS()
    const document = await fetchCollectionItems({
      collection: collection(db, 'orders'),
      orderByKey: 'creation',
      order: 'desc',
      searchLimit: 50,
      filter: [
        {
          field: 'customer_ref',
          operator: '==',
          searchterm: doc(db, 'users', uid)
        },
        {
          field: 'is_payed',
          operator: '==',
          searchterm: true
        },
        {
          field: 'status',
          operator: '==',
          searchterm: 'success'
        }
      ]
    })

    for (let i = 0; i < document.count; i++) {
      const customer = await getDoc(document.data[i].customer_ref)
      const product = await getDoc(document.data[i].product_ref)

      document.data[i].customer_ref = {
        data: customer.data(),
        id: customer.id
      }
      document.data[i].product_ref = {
        data: product.data(),
        id: product.id
      }
    }

    return NextResponse.json({ ...document }, { status: 200 })

  } catch (error) {
    console.warn(error)
    return NextResponse.json({ message: 'Internal Server Error', stack: `${error}` }, { status: 500 })
  }
}