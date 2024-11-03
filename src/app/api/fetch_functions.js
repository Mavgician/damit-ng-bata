import {
  doc,
  endBefore,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter
} from 'firebase/firestore';

export async function fetchCollectionItems(collection, order, searchLimit = 10, firstDoc, lastDoc) {
  let data = []
  let queryRef

  const initQuery = query(collection, orderBy(order), limit(searchLimit))

  const totalCount = await getCountFromServer(collection)

  if (firstDoc) {
      const cursor = await getDoc(doc(collection, firstDoc))
      queryRef = query(initQuery, endBefore(cursor))
  } else if (lastDoc) {
      const cursor = await getDoc(doc(collection, lastDoc))
      queryRef = query(initQuery, startAfter(cursor))
  } else {
      queryRef = initQuery
  }

  const snapshot = await getDocs(queryRef)

  for (let i = 0; i < snapshot.docs.length; i++) {
      data.push({...snapshot.docs[i].data(), id: snapshot.docs[i].id})
  }

  const payload = { data, count: totalCount.data().count }

  return payload
}