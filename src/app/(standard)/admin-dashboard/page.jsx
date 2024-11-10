'use client'

import {
  Button,
  Container,
  Row,
  Col,
  Table,
  Input,
  Spinner
} from 'reactstrap'

import {
  faTrash,
  faPen,
} from '@fortawesome/free-solid-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { useContext, useEffect, useState } from 'react';

import { setDoc, Timestamp } from 'firebase/firestore';
import { createContext } from 'react';
import { fetchParsed } from '@/src/lib/DataServer';

import { SetProduct, SetUser } from './modals'

import useSWR from 'swr';

const AdminTableData = createContext(null)

export default function Page() {
  const [tab, setTab] = useState(0);

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
              <h4 className='m-0'>Overview</h4>
              <h5 className='text-secondary'>Statistics here</h5>
            </div>
            <div className={tab === 1 ? '' : 'd-none'}>
              <AdminModule url='api/user/list'><Accounts /></AdminModule>
            </div>
            <div className={tab === 2 ? '' : 'd-none'}>
              <AdminModule url='api/product/list'><Products /></AdminModule>
            </div>
          </Col>
        </Row>
      </Container>
    </main>
  )
}

function AdminModule({ children, url }) {
  const [limit, setLimit] = useState(20);
  const [orderBy, setOrderBy] = useState('creation');

  const [firstDoc, setFirstDoc] = useState();
  const [lastDoc, setLastDoc] = useState();

  const [pageNumber, setPageNumber] = useState(0);

  const [isOpen, setIsOpen] = useState(false);

  const [modalData, setModalData] = useState(undefined);

  const { data, isLoading } = useSWR(
    [url, orderBy, limit, firstDoc, lastDoc],
    ([url, order, limit, firstDoc, lastDoc]) => fetchParsed(url, {
      method: 'POST',
      body: JSON.stringify({
        order: order,
        limit: limit,
        firstDoc: firstDoc,
        lastDoc: lastDoc,
      })
    }
    ))

  const maxPage = isNaN(Math.ceil(data?.count / limit)) ? 0 : Math.ceil(data?.count / limit)

  const providerValue = {
    setLimit,
    setOrderBy,
    next,
    prev,
    setIsOpen,
    setModalData,
    modalData,
    isOpen,
    pageNumber,
    maxPage,
    data
  }

  function next() {
    if (pageNumber + 1 == maxPage) return

    setLastDoc(data.data[limit - 1].id)
    setFirstDoc(undefined)

    setPageNumber(pageNumber + 1)
  }

  function prev() {
    if (pageNumber <= 0) return

    setFirstDoc(data.data[0].id)
    setLastDoc(undefined)

    setPageNumber(pageNumber - 1)
  }

  useEffect(() => {
    setPageNumber(0)
    setFirstDoc(undefined)
    setLastDoc(undefined)
  }, [orderBy]);

  if (isLoading) {
    return (
      <div className='w-100 d-flex justify-content-center align-items-center'>
        <Spinner className='m-5'></Spinner>
      </div>
    )
  }

  return <AdminTableData.Provider value={providerValue}>{children}</AdminTableData.Provider>
}

function TableControls({ setLimit, setOrderBy, next, prev }) {
  const { data, pageNumber, maxPage, setIsOpen, isOpen, setModalData } = useContext(AdminTableData)

  function addItem() {
    setModalData(undefined)
    setIsOpen(!isOpen)
  }

  return (
    <>
      <Button className='ms-3' onClick={addItem}> Add + </Button>
      <div className='d-flex flex-grow-1 justify-content-end align-items-center'>
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
        <p className='m-0' style={{ fontSize: '0.8em' }}>Page {pageNumber + 1} of {maxPage}</p>
        <Button color='light' className={'ms-1'} onClick={() => prev(data)}>&lt;</Button>
        <Button color='light' className={'ms-1'} onClick={() => next(data)}>&gt;</Button>
      </div>
    </>
  )
}

function Accounts() {
  const { setLimit, setOrderBy, next, prev, data: users } = useContext(AdminTableData)

  return (
    <>
      <div className="d-flex align-items-center mb-3">
        <h4 className='m-0'>Manage User Accounts</h4>
        <TableControls setLimit={setLimit} setOrderBy={setOrderBy} next={next} prev={prev} />
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
                  <span>{data.id}</span>
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
                  <Button outline color='success' size='sm' className='mx-1' onClick={() => { setIsOpen(false) }}>
                    View Orders
                  </Button>
                </td>
                <td className='text-muted'>
                  <Button outline color='danger' size='sm' className='mx-1' onClick={() => { setIsOpen(false) }}>
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                  <Button outline color='primary' size='sm' className='mx-1' onClick={() => { setIsOpen(false) }}>
                    <FontAwesomeIcon icon={faPen} />
                  </Button>
                </td>
              </tr>
            )
          }
        </tbody>
      </Table>
    </>
  )
}

function Products() {
  const { setLimit, setOrderBy, next, prev, data: products, setIsOpen, isOpen, setModalData } = useContext(AdminTableData)

  function edit(id) {
    setModalData(id)
    setIsOpen(!isOpen)
  }

  return (
    <>
      <SetProduct context={AdminTableData} />
      <div className="d-flex align-items-center mb-3">
        <h4 className='m-0'>Manage Products</h4>
        <TableControls setLimit={setLimit} setOrderBy={setOrderBy} next={next} prev={prev} />
      </div>
      <Table hover responsive className='p-3'>
        <thead>
          <tr>
            <th className='col-2'>ID</th>
            <th className='col-2'>Product Name</th>
            <th className='col-3'>Cateory</th>
            <th className='col-2'>Created on</th>
            <th className='col-1'>Ratings</th>
            <th className='col-2'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            products.data.map((data, idx) =>
              <tr key={`user-table-detail-${idx}`}>
                <td className='text-muted'>
                  <span>{data.id}</span>
                </td>
                <td className='text-muted'>
                  <span>{data.name}</span>
                </td>
                <td className='text-muted'>
                  <span>{data.tags.join(', ')}</span>
                </td>
                <td className='text-muted'>
                  <span>{(new Timestamp(data.creation.seconds, data.creation.nanoseconds)).toDate().toUTCString()}</span>
                </td>
                <td className='text-muted'>
                  
                </td>
                <td className='text-muted'>
                  <Button outline color='danger' size='sm' className='mx-1' onClick={() => { setIsOpen(false) }}>
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                  <Button outline color='primary' size='sm' className='mx-1' onClick={() => { edit(data.id) }}>
                    <FontAwesomeIcon icon={faPen} />
                  </Button>
                </td>
              </tr>
            )
          }
        </tbody>
      </Table>
    </>
  )
}