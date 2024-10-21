'use client'

import Link from 'next/link';

import {
  Button,
  Container,
  Row,
  Col
} from 'reactstrap'

import { useState, useEffect } from 'react';

/* import { getUserCS } from 'firebase-nextjs/client/auth'; */
import { fetchUserPost } from '@/src/lib/DataServer';

import useSWR from 'swr';
import Image from 'next/image';
import { Timestamp } from 'firebase/firestore';

function Order({ orderReference }) {
  const [order, setOrder] = useState({
    seat: {
      type: 'seatType',
      location_index: [],
      type_index: 0
    },
    claim_type: 'claimType',
    date: undefined
  });
  const [ticket, setTicket] = useState({
    title: 'ticketTitle',
    poster_image_url: '',
    seat: [
      { price: 0 }
    ]
  });
  const [ID, setID] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    (async () => {
      const ref = await getDoc(orderReference)
      setOrder(ref.data())
      setTicket((await getDoc(ref.data().ticket_ref)).data())
      setID(ref.data().ticket_ref.id)
      setLoading(false)
    })()
  }, []);

  return (
    !loading &&
    <Link href={`/tickets/${ID}`} className='bg-light text-dark rounded p-3 border d-block mb-3 text-decoration-none'>
      <Row>
        <Col xs={1} sm={1} md={1} lg={1}>
          <Image src={ticket.poster_image_url} height={0} width={0} sizes='100%' style={{ height: 'auto', width: '100%' }} />
        </Col>
        <Col xs={11} sm={11} md={11} lg={11}>
          <h3 className='m-0'>{ticket.title}</h3>
          <div className='d-flex mb-2'>
            <p className='m-0 me-3'>Price: PHP {ticket.seat[order.seat.type_index].price}</p>
            <p className='m-0 me-3'>Seat: {order.seat.type} - {order.seat.location_index.join(' ')}</p>
            <p className='m-0 me-3'>Type: {order.claim_type}</p>
          </div>
          <p className='text-secondary m-0'>Order ID: {orderReference.id}</p>
          <p className='text-secondary m-0'>
            Date: {order.date.toDate().toDateString()} {order.date.toDate().toLocaleTimeString('en-us', { hour: "2-digit", minute: "2-digit", timeZoneName: 'short' })}
          </p>
        </Col>
      </Row>
    </Link>
  )
}

export default function Page() {
  const { data: user } = useSWR('api/user/verify', fetchUserPost, { suspense: true })

  const [tab, setTab] = useState(0);

  const timestamp = new Timestamp(user.creation.seconds, user.creation.nanoseconds)

  return (
    <main className='bg-light text-dark'>
      <Container className='p-5' fluid>
        <h1>Account Overview</h1>
        <Row>
          <Col xs={12} s={12} md={2} lg={2}>
            <div className='my-3'>
              <Button active={tab === 0} onClick={() => setTab(0)} className='text-start text-secondary' block color='light'>ACCOUNT</Button>
              <Button active={tab === 1} onClick={() => setTab(1)} className='text-start mt-2 text-secondary' block color='light'>ORDERS</Button>
              <Button active={tab === 2} onClick={() => setTab(1)} className='text-start mt-2 text-secondary' block color='light'>PRIVACY & SECURITY</Button>
            </div>
          </Col>
          <Col xs={12} s={12} md={10} lg={10}>
            <div className={tab === 0 ? '' : 'd-none'}>
              <h4>Basic Information</h4>
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
            </div>
            <div className={tab === 1 ? '' : 'd-none'}>
              <h4>Orders ({user.orders.length})</h4>
              {user.orders.length > 0 ? user.orders.map(order => <Order key={order.id} orderReference={order} />) : <h3 className='text-secondary'>No orders to see here</h3>}
            </div>
            <div className={tab === 2 ? '' : 'd-none'}>
              <h4>Privacy</h4>
            </div>
          </Col>
        </Row>
      </Container>
    </main>
  )
}