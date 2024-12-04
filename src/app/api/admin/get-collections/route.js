import { db } from '@/firebase-app-config.js'
import { collection, doc, getDoc, getDocs, query } from 'firebase/firestore';

import { NextResponse } from 'next/server';

import { getUserSS } from "firebase-nextjs/server/auth";

export async function POST() {
  try {
    const firebase_user = await getUserSS()
    const is_admin = (await getDoc(doc(db, 'users', firebase_user.uid))).data().type
    let collection_list = []

    if (!is_admin) return NextResponse.json({ error: 'Cannot fetch collection list. User lacks permission.' }, { status: 401 })

    const collections_snapshot = await getDocs(collection(db, 'collections'))

    collections_snapshot.forEach(snapshot => 
      collection_list.push({
        data: snapshot.data(),
        id: snapshot.id
      })
    )

    return NextResponse.json({ data: collection_list, count: collection_list.length}, { status: 200 })

  } catch (error) {
    console.warn(error)
    return NextResponse.json({ message: 'Internal Server Error', stack: `${error}` }, { status: 500 })
  }
}