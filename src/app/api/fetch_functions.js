import {
  doc,
  endBefore,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  startAfter,
  where
} from 'firebase/firestore';

export async function fetchCollectionItems(collection, order, searchLimit = 10, firstDoc, lastDoc, filter) {
  let data = []
  let queryRef

  let initQuery

  if (filter) {
    initQuery = query(collection, orderBy(order), where(filter.field, filter.operator, filter.searchterm))
  } else {
    initQuery = query(collection, orderBy(order))
  }
  
  const totalCount = await getCountFromServer(collection)

  if (firstDoc) {
      const cursor = await getDoc(doc(collection, firstDoc))
      queryRef = query(initQuery, endBefore(cursor), limitToLast(searchLimit))
  } else if (lastDoc) {
      const cursor = await getDoc(doc(collection, lastDoc))
      queryRef = query(initQuery, startAfter(cursor), limit(searchLimit))
  } else {
      queryRef = query(initQuery, limit(searchLimit))
  }

  const snapshot = await getDocs(queryRef)

  for (let i = 0; i < snapshot.docs.length; i++) {
      data.push({...snapshot.docs[i].data(), id: snapshot.docs[i].id})
  }

  const payload = { data, count: totalCount.data().count }

  return payload
}