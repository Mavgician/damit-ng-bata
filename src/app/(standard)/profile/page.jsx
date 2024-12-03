'use client'

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
import { Address } from './Address'
import { AddAddress } from './AddAddress'

import useSWR from 'swr';

const PageContext = createContext(null)

export default function Page() {
  const { data: user, isLoading, mutate } = useSWR(['api/user/verify'], ([url]) => fetchParsed(url, { method: 'POST' }))

  const [tab, setTab] = useState(0);

  return (
    <main className='bg-light text-dark'>
      <Container className='p-5'>
        <Row>
          <Col md={3}>
            <div className='p-4 border my-3 rounded' style={{ background: 'white' }}>
              <h2 className='mb-4'>Account Overview</h2>

              <p className='mt-4 mb-3 text-secondary'>Account Settings</p>
              <Button active={tab === 0} onClick={() => setTab(0)} className='text-start text-secondary' block color='light'>ACCOUNT</Button>
              <Button active={tab === 1} onClick={() => setTab(1)} className='text-start mt-2 text-secondary' block color='light'>PRIVACY & SECURITY</Button>
              <Button active={tab === 2} onClick={() => setTab(2)} className='text-start mt-2 text-secondary' block color='light'>ADDRESS BOOK</Button>

              <p className='mt-4 mb-3 text-secondary'>Shopping</p>
              <Button active={tab === 3} onClick={() => setTab(3)} className='text-start mt-2 text-secondary' block color='light'>ORDERS</Button>
              <Button active={tab === 4} onClick={() => setTab(4)} className='text-start mt-2 text-secondary' block color='light'>CANCELLATIONS & REFUNDS</Button>
            </div>
          </Col>
          <Col className='p-4 border my-3 rounded' style={{ background: 'white' }} md={9}>
            {
              !isLoading && (
                <PageContext.Provider value={{ user, setTab, tab, mutate }}>
                  <div className={tab === 0 ? '' : 'd-none'}>
                    <Account context={PageContext} />
                  </div>
                  <div className={tab === 1 ? '' : 'd-none'}>
                    <p className='fs-3'>Privacy and Security</p>
                    <p>To be implemented</p>
                  </div>
                  <div className={tab === 2 ? '' : 'd-none'}>
                    <Address context={PageContext}/>
                  </div>
                  <div className={tab === 3 ? '' : 'd-none'}>
                    <Orders context={PageContext} />
                  </div>
                  <div className={tab === 4 ? '' : 'd-none'}>
                    <p className='fs-3'>Cancellation & Refunds (0)</p>
                    <p>To be implemented</p>
                  </div>
                  <div className={tab === 10 ? '' : 'd-none'}>
                    <AddAddress context={PageContext}/>
                  </div>
                </PageContext.Provider>
              )
            }
          </Col>
        </Row>
      </Container>
    </main>
  )
}