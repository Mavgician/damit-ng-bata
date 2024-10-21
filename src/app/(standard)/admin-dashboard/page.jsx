'use client'

import {
  Button,
  Container,
  Row,
  Col,
  Table,
  Input
} from 'reactstrap'

import { useState } from 'react';
import useSWR from 'swr';
import { Timestamp } from 'firebase/firestore';

const fetchUserList = (url, order, limit, firstDoc, lastDoc) => fetch(url, {
  method: 'POST',
  body: JSON.stringify({
    order: order,
    limit: limit,
    firstDoc: firstDoc,
    lastDoc: lastDoc,
  })
}).then(data => data.json())

export default function Page() {
  const [limit, setLimit] = useState(20);
  const [orderBy, setOrderBy] = useState('creation');

  const [firstDoc, setFirstDoc] = useState();
  const [lastDoc, setLastDoc] = useState();

  const [tab, setTab] = useState(0);

  const { data: users } = useSWR(
    ['api/user/list', orderBy, limit, firstDoc, lastDoc],
    ([url, order, limit, firstDoc, lastDoc]) => fetchUserList(url, order, limit, firstDoc, lastDoc),
    { suspense: true }
  )

  function next() {
    setLastDoc(users.docs[limit - 1])
    setFirstDoc(undefined)
  }

  function prev() {
    setFirstDoc(users.docs[0])
    setLastDoc(undefined)
  }

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
              <div className="d-flex align-items-center mb-3">
                <h4 className='m-0'>Manage user accounts</h4>
                <div className='d-flex flex-grow-1 justify-content-end'>
                  <div className='d-flex align-items-center gap-2 me-3'>
                    <p className="m-0">Show</p>
                    <div>
                      <Input
                        type='select'
                        onChange={(e) => { setLimit(Number(e.target.value)) }}
                      >
                        <option value={20}>20</option>
                        <option value={15}>15</option>
                        <option value={10}>10</option>
                        <option value={5}>5</option>
                      </Input>
                    </div>
                  </div>
                  <div className='d-flex align-items-center gap-2 me-3'>
                    <p className="m-0">Sort by</p>
                    <div>
                      <Input
                        type='select'
                        onChange={(e) => { setOrderBy(e.target.value) }}
                      >
                        <option value={'creation'}>Creation</option>
                        <option value={'name'}>Name</option>
                        <option value={'id'}>ID</option>
                        <option value={'email'}>Email</option>
                        <option value={'type'}>Type</option>
                      </Input>
                    </div>
                  </div>
                  <Button color='secondary' className={'ms-1'} onClick={prev}>prev</Button>
                  <Button color='secondary' className={'ms-1'} onClick={next}>next</Button>
                </div>
              </div>
              <Table hover responsive className='p-3'>
                <thead>
                  <tr>
                    <th className='col-2'>ID</th>
                    <th className='col-2'>Email</th>
                    <th className='col-2'>Display Name</th>
                    <th className='col-2'>Created on</th>
                    <th className='col-1'>Type</th>
                    <th className='col-1'>Orders</th>
                    <th className='col-2'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    users.data.map((data, idx) =>
                      <tr key={`user-table-detail-${idx}`}>
                        <td className='text-muted'>
                          <span>{users.docs[idx]}</span>
                        </td>
                        <td className='text-muted'>
                          <span>{data.email}</span>
                        </td>
                        <td className='text-muted'>
                          <span>{data.name.display}</span>
                        </td>
                        <td className='text-muted'>
                          <span>{(new Timestamp(data.creation.seconds, data.creation.nanoseconds)).toDate().toUTCString()}</span>
                        </td>
                        <td className='text-muted'>
                          <span>{data.type}</span>
                        </td>
                        <td className='text-muted'>
                          <span>View Orders</span>
                        </td>
                        <td className='text-muted'>
                          <span>action</span>
                        </td>
                      </tr>
                    )
                  }
                </tbody>
              </Table>
            </div>
            <div className={tab === 2 ? '' : 'd-none'}>
              <div className="d-flex align-items-center mb-3">
                <h4 className='m-0'>Manage products</h4>
                <Button className='ms-3'> Add + </Button>
                <div className='d-flex flex-grow-1 justify-content-end'>
                  <div className='d-flex align-items-center gap-2 me-5'>
                    <p className="m-0 w-100">Sort by</p>
                    <Input
                      placeholder='Genre'
                      type='select'
                      onChange={(e) => { setOrderBy(e.target.value) }}
                    >
                      <option value={'creation'}>Creation</option>
                      <option value={'name'}>Name</option>
                      <option value={'id'}>ID</option>
                      <option value={'email'}>Email</option>
                      <option value={'type'}>Type</option>
                    </Input>
                  </div>
                  <Button color='secondary' className={'ms-1'} onClick={prev}>prev</Button>
                  <Button color='secondary' className={'ms-1'} onClick={next}>next</Button>
                </div>
              </div>
              <Table hover responsive className='p-3'>
                <thead>
                  <tr>
                    <th className='col-2'>ID</th>
                    <th className='col-2'>Product Name</th>
                    <th className='col-2'>Category</th>
                    <th className='col-2'>Created on</th>
                    <th className='col-1'>Type</th>
                    <th className='col-1'>Ratings</th>
                    <th className='col-2'>Actions</th>
                  </tr>
                </thead>
                <tbody>

                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </Container>
    </main>
  )
}