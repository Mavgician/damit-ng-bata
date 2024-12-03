'use client'

import { getUserCS } from 'firebase-nextjs/client/auth';
import { Timestamp } from 'firebase/firestore';
import { useContext } from 'react';
import { Col, Row } from 'reactstrap';

export function Account({ context }) {
  const { user } = useContext(context)

  const { currentUser } = getUserCS()

  const imageUrl = currentUser?.photoURL ??
    "https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=" + (currentUser.displayName ?? currentUser.email);

  const timestamp = new Timestamp(user?.creation.seconds, user?.creation.nanoseconds)

  return (
    <>
      <p className='fs-3'>Basic Information</p>
      <div className='d-flex justify-content-center mb-3'>
        <img src={imageUrl} className='rounded' alt="" />
      </div>
      <h4 className='text-center mb-0'>{user.name.display}</h4>
      <p className='text-center text-secondary mb-4 mt-0'>Display Name</p>
      <Row className='border rounded p-2'>
        <Col md={4} className='mb-3'>
          <p className='m-0 text-secondary'>Full Name</p>
          <p className='m-0'>{user.name.first} {user.name.last}</p>
        </Col>
        <Col md={4} className='mb-3'>
          <p className='m-0 text-secondary'>Email Address</p>
          <p className='m-0'>{user.email}</p>
        </Col>
        <Col md={4}>
          <p className='m-0 text-secondary'>Account Type</p>
          <p className='m-0'>{user.type}</p>
        </Col>
        <Col md={4}>
          <p className='m-0 text-secondary'>Account creation</p>
          <p className='m-0'>{timestamp.toDate().toLocaleString()}</p>
        </Col>
      </Row>
    </>
  )
}