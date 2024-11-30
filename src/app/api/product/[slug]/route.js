import { db } from '@/firebase-app-config.js'
import { addDoc, collection, deleteDoc, doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { NextResponse } from 'next/server';

import { v2 as cloudinary } from 'cloudinary';

import { fetchCollectionItems } from '@/api/fetch_functions'

const collectionRef = collection(db, 'products')

async function init(req) {
  let body, name, name_insensitive, newProductData, new_carouselurls = []

  try {
    body = await req.json()
  } catch {
    console.warn('Request body is not set.')
  }

  try {

    try {
      name = body.name.split(' ')
      name_insensitive = body.name.toLowerCase().split(' ')
    } catch {
      let insensitive = []
      body.name.forEach(name => insensitive.push(name.toLowerCase()))
      name = body.name
      name_insensitive = insensitive
    }

    newProductData = {
      carouselurls: body.carouselurls,
      description: body.description,
      is_available: body.is_available,
      name: name,
      name_insensitive: name_insensitive,
      price: body.price,
      tags: body.tags,
      thmburl: body.thumbnail,
      type: body.type,
      category: body.category,
      creation: body.creation
    }

    for (let i = 0; i < newProductData.carouselurls.length; i++) {
      const image = newProductData.carouselurls[i]

      let uploadResult

      if (image.url) {
        const existing = await fetch(image.url)

        if (existing.status === 200) {
          new_carouselurls.push(image)
          continue
        }
      }

      uploadResult = await cloudinary.uploader.upload(
        image?.content ?? image.url,
        {
          upload_preset: 'unsigned_productimg',
          api_key: process.env.CLOUDINARY_API_KEY,
          public_id: image.id ?? `${newProductData.name}-${image.name}-${i}`,
        }
      )

      new_carouselurls.push(
        {
          url: uploadResult.secure_url,
          id: uploadResult.public_id
        }
      )
    }

    newProductData.carouselurls = new_carouselurls

  } catch {
    console.warn('Request body is not for submission.')
  }

  return ({ body, newProductData })
}

export async function POST(req, { params }) {
  const { body, newProductData } = await init(req)

  try {
    switch (params.slug) {
      case 'add':
        await addDoc(
          collectionRef,
          {
            ...newProductData,
            thmburl: newProductData.carouselurls[0],
            creation: Timestamp.now(),
            last_modified: Timestamp.now()
          })
        break

      case 'update':
        newProductData.thmburl = newProductData.carouselurls[0]

        await setDoc(
          doc(collectionRef, body.id),
          {
            ...newProductData,
            creation: new Timestamp(newProductData.creation.seconds, newProductData.creation.nanoseconds),
            last_modified: Timestamp.now()
          })
        break

      case 'list':
        const items = await fetchCollectionItems(
          collectionRef,
          body.orderBy,
          body.order,
          body.limit,
          body.firstDoc,
          body.lastDoc,
          body.search
        )

        return NextResponse.json(items, { status: 200 })

      case 'item':
        const document = doc(collectionRef, body.id)
        const product = (await getDoc(document)).data()

        return NextResponse.json({ ...product, id: (await getDoc(document)).id }, { status: 200 })

      default:
        return NextResponse.json({ error: 'Unknown fetch type' }, { status: 501 })
    }
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Wrong request', message: error }, { status: 500 })
  }

  return NextResponse.json({ message: 'success' }, { status: 200 })
}

export async function DELETE(req, { params }) {
  const { body } = await init(req)

  try {
    switch (params.slug) {
      case 'item':
        await deleteDoc(doc(collectionRef, body.id))
        break

      default:
        return NextResponse.json({ error: 'Unknown fetch type' }, { status: 501 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Wrong request', message: error }, { status: 500 })
  }

  return NextResponse.json({ message: 'success' }, { status: 200 })
}