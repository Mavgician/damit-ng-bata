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

export async function fetchCollectionItems({collection, orderByKey = 'creation', order = 'desc', searchLimit = 10, firstDoc, lastDoc, filter}) {
  let data = []
  let queryRef

  let initQuery, search = []

  filter?.forEach(f => search.push(where(f.field, f.operator, f.searchterm)))

  if (search.length > 0) {
    initQuery = query(collection, orderBy(orderByKey, order), ...search)
  } else {
    initQuery = query(collection, orderBy(orderByKey, order))
  }

  if (firstDoc) {
      const cursor = await getDoc(doc(collection, firstDoc))
      queryRef = query(initQuery, endBefore(cursor), limitToLast(searchLimit))
  } else if (lastDoc) {
      const cursor = await getDoc(doc(collection, lastDoc))
      queryRef = query(initQuery, startAfter(cursor), limit(searchLimit))
  } else {
      queryRef = query(initQuery, limit(searchLimit))
  }

  const queryCount = await getCountFromServer(initQuery)
  const snapshot = await getDocs(queryRef)

  for (let i = 0; i < snapshot.docs.length; i++) {
      data.push({...snapshot.docs[i].data(), id: snapshot.docs[i].id})
  }

  const payload = { data, count: queryCount.data().count }

  return payload
}