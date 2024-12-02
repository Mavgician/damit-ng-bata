'use client'

import { Timestamp } from 'firebase/firestore';
import { useContext } from 'react';

export function Account({ context }) {
  const { user } = useContext(context)

  const timestamp = new Timestamp(user?.creation.seconds, user?.creation.nanoseconds)

  return (
    <>
      <p className='fs-3'>Basic Information</p>
      <b>
        <p className='m-0'>Name: {user.name.first} {user.name.last}</p>
        <p className='m-0'>Username: {user.name.display}</p>
      </b>
      <div className="d-flex align-items-center gap-3 mt-2">
        <p className='m-0'>Email: {user.email}</p>
        <p className='m-0'>Phone: 0912345678</p>
        <p className='m-0'>Account type: {user.type}</p>
      </div>
      <p className="m-0">Account created at: {timestamp.toDate().toLocaleString()}</p>
    </>
  )
}