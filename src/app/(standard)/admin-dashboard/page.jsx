'use client'

import {
  Button,
  Container,
  Row,
  Col
} from 'reactstrap'

import { useState } from 'react';
import useSWR from 'swr';
import { fetchUserPost } from '@/lib/DataServer';

const fetchUserList = (url) => fetch(url, {
  method: 'POST',
  body: JSON.stringify({
    order: "user",
    limit: 10
  })
}).then(data => data.json())

export default function Page() {
  const { data } = useSWR('api/user/list', fetchUserList, { suspense: true })
  const [tab, setTab] = useState(0);

  console.log(data);
  

  return (
    <main className='bg-light text-dark'>
      <Container className='p-5' fluid>
        <h1>Admin Dashboard</h1>
        <Row>
          <Col xs={12} s={12} md={2} lg={2}>
            <div className='my-3'>
              <Button active={tab === 0} onClick={() => setTab(0)} className='text-start text-secondary' block color='light'>OVERVIEW</Button>
              <Button active={tab === 1} onClick={() => setTab(1)} className='text-start mt-2 text-secondary' block color='light'>ACCOUNTS</Button>
              <Button active={tab === 2} onClick={() => setTab(2)} className='text-start mt-2 text-secondary' block color='light'>PRODUCTS</Button>
            </div>
          </Col>
          <Col xs={12} s={12} md={10} lg={10}>
            <div className={tab === 0 ? '' : 'd-none'}>
              <h4>Overview</h4>
              <h5 className='text-secondary'>Statistics here</h5>
            </div>
            <div className={tab === 1 ? '' : 'd-none'}>
              <h4>Manage user accounts</h4>
              <h5 className='text-secondary'>User table here</h5>
            </div>
            <div className={tab === 2 ? '' : 'd-none'}>
              <h4>Manage products</h4>
              <h5 className='text-secondary'>Product table here</h5>
            </div>
          </Col>
        </Row>
      </Container>
    </main>
  )
}