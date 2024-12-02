'use client'

import Link from 'next/link';

import {
  Button,
  Container,
  Row,
  Col
} from 'reactstrap'

import { useState, createContext } from 'react';
import { fetchParsed } from '@/src/lib/fetch-parsed';

import { Account } from './Account'
import { Orders } from './Orders'

import useSWR from 'swr';

const UserContext = createContext(null)

export default function Page() {
  const { data: user, isLoading } = useSWR(['api/user/verify'], ([url]) => fetchParsed(url, { method: 'POST' }))
  const [tab, setTab] = useState(0);

  return (
    <main className='bg-light text-dark'>
      <Container className='p-5'>
        <h1>Account Overview</h1>
        <Row>
          <Col md={3}>
            <div className='my-3'>
              <Button active={tab === 0} onClick={() => setTab(0)} className='text-start text-secondary' block color='light'>ACCOUNT</Button>
              <Button active={tab === 1} onClick={() => setTab(1)} className='text-start mt-2 text-secondary' block color='light'>ORDERS</Button>
              <Button active={tab === 2} onClick={() => setTab(1)} className='text-start mt-2 text-secondary' block color='light'>PRIVACY & SECURITY</Button>
            </div>
          </Col>
          <Col md={9}>
            {
              !isLoading && (
                <UserContext.Provider value={{ user }}>
                  <div className={tab === 0 ? '' : 'd-none'}>
                    <Account context={UserContext} />
                  </div>
                  <div className={tab === 1 ? '' : 'd-none'}>
                    <Orders context={UserContext} />
                  </div>
                </UserContext.Provider>
              )
            }
          </Col>
        </Row>
      </Container>
    </main>
  )
}