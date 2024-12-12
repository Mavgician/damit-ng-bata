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

import { Timestamp } from 'firebase/firestore';
import { createContext } from 'react';
import { fetchParsed } from '@/lib/fetch-parsed'

import { SetProduct, SetUser } from './modals'

import { ConfirmationModal } from '@/src/components/modal_template';

import useSWR from 'swr';

const AdminTableData = createContext(null)
const ConfirmModalContext = createContext(null)

export default function Page() {
  const [tab, setTab] = useState(0);

  return (
    <main className='bg-light text-dark'>
      <Container className='p-5' fluid>
        <Row>
          <Col md={2}>
            <div className='p-4 border my-3 rounded' style={{ background: 'white' }}>
              <h2 className='mb-4'>Admin Dashboard</h2>
              <Button active={tab === 0} onClick={() => setTab(0)} className='text-start text-secondary' block color='light'>OVERVIEW</Button>
              <Button active={tab === 1} onClick={() => setTab(1)} className='text-start mt-2 text-secondary' block color='light'>ACCOUNTS</Button>
              <Button active={tab === 2} onClick={() => setTab(2)} className='text-start mt-2 text-secondary' block color='light'>PRODUCTS</Button>
            </div>
          </Col>
          <Col className='p-4 border my-3 rounded' style={{ background: 'white' }} md={10}>
            <div className={tab === 0 ? '' : 'd-none'}>
              <h4>Overview</h4>
              Moved to Vercel Web Analytics.
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
  const [orderBy, setOrderBy] = useState({ key: 'creation', order: 'asc' });

  const [firstDoc, setFirstDoc] = useState();
  const [lastDoc, setLastDoc] = useState();

  const [pageNumber, setPageNumber] = useState(0);

  const [isOpen, setIsOpen] = useState(false);

  const [modalData, setModalData] = useState(undefined);

  const [submit, setSubmitfunc] = useState(() => () => { });
  const [cancel, setCancelFunc] = useState(() => () => { setModalData(undefined) });

  const [submitData, setSubmitData] = useState({});
  const [submitType, setSubmitType] = useState('add');

  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const { data, isLoading, mutate } = useSWR(
    [url, orderBy, limit, firstDoc, lastDoc],
    ([url, order, limit, firstDoc, lastDoc]) => fetchParsed(url, {
      method: 'POST',
      body: JSON.stringify({
        orderBy: order.key,
        order: order.order,
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
    setSubmitfunc,
    setCancelFunc,
    setSubmitData,
    setSubmitType,
    limit,
    orderBy,
    modalData,
    isOpen,
    pageNumber,
    maxPage,
    data,
    submit,
    cancel,
    submitData,
    submitType,
    refetch: mutate,
    isSubmitLoading,
    setIsSubmitLoading
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

  return <AdminTableData.Provider value={providerValue}><div className='border rounded'>{children}</div></AdminTableData.Provider>
}

function TableControls({ setLimit, setOrderBy, next, prev, children, noAdd = false }) {
  const { data, pageNumber, maxPage, setIsOpen, isOpen, setModalData, setSubmitType, limit, orderBy } = useContext(AdminTableData)

  function addItem() {
    setModalData(null)
    setIsOpen(!isOpen)
    setSubmitType('add')
  }

  const [sort, setSort] = useState(orderBy.key);
  const [order, setOrder] = useState(orderBy.order);

  function handleOrderBy(data) {
    if (data?.sort) {
      setOrderBy({ key: data.sort, order: order })
      setSort(data.sort)
    }

    if (data?.order) {
      setOrderBy({ key: sort, order: data.order })
      setOrder(data.order)
    }
  }

  return (
    <>
      <div className="d-flex align-items-center p-3">
        <h4 className='m-0'>{children}</h4>
        { !noAdd && <Button className='ms-3' onClick={addItem}> Add + </Button> }
        <div className='d-flex flex-grow-1 justify-content-end align-items-center'>
          <div className='d-flex align-items-center gap-2 me-3'>
            <p className="m-0">Show</p>
            <div>
              <Input
                type='select'
                onChange={(e) => { setLimit(Number(e.target.value)) }}
                value={limit}
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
                onChange={(e) => { handleOrderBy({ sort: e.target.value }) }}
                value={sort}
              >
                <option value={'__name__'}>ID</option>
                <option value={'creation'}>Creation</option>
                <option value={'last_modified'}>Last Modified</option>
                <option value={'name'}>Name</option>
              </Input>
            </div>
          </div>
          <div className='d-flex align-items-center gap-2 me-3'>
            <p className="m-0">Order by</p>
            <div>
              <Input
                type='select'
                onChange={(e) => { handleOrderBy({ order: e.target.value }) }}
                value={order}
              >
                <option value={'asc'}>Ascending</option>
                <option value={'desc'}>Descending</option>
              </Input>
            </div>
          </div>
          <p className='m-0' style={{ fontSize: '0.8em' }}>Page {pageNumber + 1} of {maxPage}</p>
          <Button color='light' className={'ms-1'} onClick={() => prev(data)}>&lt;</Button>
          <Button color='light' className={'ms-1'} onClick={() => next(data)}>&gt;</Button>
        </div>
      </div>
    </>
  )
}

function Accounts() {
  const {
    setLimit,
    setOrderBy,
    next,
    prev,
    data: users,
    setIsOpen,
    setModalData,
    setSubmitfunc,
    submitData,
    setSubmitType,
    submitType,
    refetch,
    isSubmitLoading,
    setIsSubmitLoading
  } = useContext(AdminTableData)

  async function submit(data, type) {
    if (isSubmitLoading) return

    setIsSubmitLoading(true)

    await fetch(
      `api/user/${type}`,
      {
        method: 'POST',
        body: JSON.stringify(data)
      }
    )

    setIsOpen(false)
    setIsSubmitLoading(false)
    await refetch()
  }

  function edit(data) {
    setModalData(data)
    setIsOpen(true)
    setSubmitType('update')
  }

  useEffect(() => {
    setSubmitfunc(() => () => { submit(submitData, submitType) })
  }, [submitData, submitType]);

  return (
    <>
      <SetUser context={AdminTableData} />
      <TableControls setLimit={setLimit} setOrderBy={setOrderBy} next={next} prev={prev} noAdd>
        Manage User Accounts
      </TableControls>
      <Table hover responsive className='p-3'>
        <thead>
          <tr>
            <th className='col-1'>ID</th>
            <th className='col-3'>Email</th>
            <th className='col-3'>Display Name</th>
            <th className='col-1'>Type</th>
            <th className='col-1'>Created on</th>
            <th className='col-1'>Last Modified</th>
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
                  <span>{data.type}</span>
                </td>
                <td className='text-muted'>
                  <span>{(new Timestamp(data.creation.seconds, data.creation.nanoseconds)).toDate().toUTCString()}</span>
                </td>
                <td className='text-muted'>
                  <span>{(new Timestamp(data.creation.seconds, data.creation.nanoseconds)).toDate().toUTCString()}</span>
                </td>
                <td className='text-muted'>
                  <div className="d-flex">
                    <Button outline color='primary' size='sm' className='mx-1' onClick={() => { edit(data) }}>
                      <FontAwesomeIcon icon={faPen} />
                    </Button>
                  </div>
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
  const {
    setLimit,
    setOrderBy,
    next,
    prev,
    data: products,
    setIsOpen,
    setModalData,
    setSubmitfunc,
    submitData,
    setSubmitType,
    submitType,
    refetch,
    isSubmitLoading,
    setIsSubmitLoading
  } = useContext(AdminTableData)

  const [confirmModal, setConfirmModal] = useState(false);
  const [id, setId] = useState('');

  async function submit(data, type) {
    if (isSubmitLoading) return

    setIsSubmitLoading(true)

    await fetch(
      `api/product/${type}`,
      {
        method: 'POST',
        body: JSON.stringify(data)
      }
    )

    setIsOpen(false)
    setIsSubmitLoading(false)
    await refetch()
  }

  function edit(data) {
    setModalData(data)
    setIsOpen(true)
    setSubmitType('update')
  }

  async function removeConfirm(id) {
    setId(id)
    setConfirmModal(true)
  }

  async function removeDoc() {
    if (isSubmitLoading) return
    setIsSubmitLoading(true)

    await fetch(
      'api/product/item',
      {
        method: 'DELETE',
        body: JSON.stringify({ id: id })
      }
    )

    setConfirmModal(false)
    setIsSubmitLoading(false)
    refetch()
  }

  useEffect(() => {
    setSubmitfunc(() => () => { submit(submitData, submitType) })
  }, [submitData, submitType]);

  return (
    <>
      <SetProduct context={AdminTableData} />
      <ConfirmModalContext.Provider value={{ isOpen: confirmModal, setIsOpen: setConfirmModal, cancel: () => { }, submit: removeDoc }}>
        <ConfirmationModal context={ConfirmModalContext}>
          You will be deleting this product with id of <b>{id}</b>.
        </ConfirmationModal>
      </ConfirmModalContext.Provider>
      <TableControls setLimit={setLimit} setOrderBy={setOrderBy} next={next} prev={prev}>
        Manage Products
      </TableControls>
      <Table hover responsive className='p-3'>
        <thead>
          <tr>
            <th className='col-1'>ID</th>
            <th className='col-2'>Product Name</th>
            <th className='col-2'>Categories</th>
            <th className='col-2'>Types</th>
            <th className='col-2'>Ratings</th>
            <th className='col-1'>Created on</th>
            <th className='col-1'>Last modified</th>
            <th className='col-1'>Actions</th>
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
                  <span>{data.name.join(' ')}</span>
                </td>
                <td className='text-muted'>
                  <span>
                    {
                      data.tags.length > 0 ?
                        data.tags.join(', ')
                        :
                        <span className='fst-italic'>No tags defined</span>
                    }
                  </span>
                </td>
                <td className='text-muted'>
                  {
                    data.type.length > 0 ?
                      data.type.map(data => `${Object.keys(data)[0]}, `)
                      :
                      <span className='fst-italic'>No types defined</span>
                  }
                </td>
                <td className='text-muted'>

                </td>
                <td className='text-muted'>
                  <span>{(new Timestamp(data.creation.seconds, data.creation.nanoseconds)).toDate().toUTCString()}</span>
                </td>
                <td className='text-muted'>
                  <span>{(new Timestamp(data.last_modified.seconds, data.last_modified.nanoseconds)).toDate().toUTCString()}</span>
                </td>
                <td className='text-muted'>
                  <Button outline color='danger' size='sm' className='mx-1' onClick={() => { removeConfirm(data.id) }}>
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                  <Button outline color='primary' size='sm' className='mx-1' onClick={() => { edit(data) }}>
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