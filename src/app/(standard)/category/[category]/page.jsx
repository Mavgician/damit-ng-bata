'use client';

import {
  Container,
  Row,
  Col,
  Label,
  Input,
  Button
} from 'reactstrap'
import { fetchParsed } from '@/lib/fetch-parsed'
import { useState } from 'react';

import Link from 'next/link'
import useSWR from 'swr'

import Skeleton from 'react-loading-skeleton';
import { ProductCard } from '@/src/components/ProductCard';

export default function Page({ params }) {
  const [orderBy, setOrderBy] = useState({ key: 'creation', order: 'asc' });

  const [firstDoc, setFirstDoc] = useState();
  const [lastDoc, setLastDoc] = useState();
  const [pageNumber, setPageNumber] = useState(0);

  const limit = 8

  const { data: product, isLoading } = useSWR([['/api/product/list'], orderBy, limit, firstDoc, lastDoc],
    ([url, order, limit, firstDoc, lastDoc]) => fetchParsed(url, {
      method: 'POST',
      body: JSON.stringify({
        orderBy: order.key,
        order: order.order,
        limit: limit,
        firstDoc, lastDoc,
        search: [
          {
            field: 'category',
            operator: '==',
            searchterm: params.category
          }
        ]
      })
    }))

  const maxPage = isNaN(Math.ceil(product?.count / limit)) ? 0 : Math.ceil(product?.count / limit)

  function next() {
    if (pageNumber + 1 == maxPage) return

    setLastDoc(product.data[limit - 1].id)
    setFirstDoc(undefined)

    setPageNumber(pageNumber + 1)
  }

  function prev() {
    if (pageNumber <= 0) return

    setFirstDoc(product.data[0].id)
    setLastDoc(undefined)

    setPageNumber(pageNumber - 1)
  }

  return (
    <main className='bg-light pb-5 mb-5'>
      <section className="product-grid">
        <Container>
          <div className='text-secondary d-flex gap-2'>
            <Link className='text-reset text-decoration-none' href={'/'}>Homepage</Link>
            &gt;
            <Link className='text-reset text-decoration-none' href={`/${params.category}`}>{params.category}</Link>
          </div>
          <h1 className='my-3' style={{ fontSize: '3em' }}>{params.category.toUpperCase()}</h1>
          <Row className="mt-4 pb-3">
            <Col className='d-flex align-items-end'>
              <p className='m-0 flex-grow-1'>{product?.count ?? 0} products</p>
            </Col>
            <Col className='d-flex justify-content-end'>
              <div className='d-flex align-items-center border rounded ps-2'>
                Page {pageNumber + 1} of {maxPage}
                <Button disabled={isLoading} color='light' className={'ms-1'} onClick={() => prev(product)}>&lt;</Button>
                <Button disabled={isLoading} color='light' className={'ms-1'} onClick={() => next(product)}>&gt;</Button>
              </div>
              <Row className='w-50'>
                <Label md={4} className='d-flex justify-content-end'><h5 className='m-0'>Sort by</h5></Label>
                <Col md={8}>
                  <Input
                    type='select'
                    onChange={e => setOrderBy(JSON.parse(e.target.value))}
                  >
                    <option value={JSON.stringify({ key: 'creation', order: 'asc' })}>Newest</option>
                    <option value={JSON.stringify({ key: 'creation', order: 'desc' })}>Oldest</option>
                    <option value={JSON.stringify({ key: 'price', order: 'asc' })}>Price: Low to High</option>
                    <option value={JSON.stringify({ key: 'price', order: 'desc' })}>Price: High to Low</option>
                  </Input>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row>
            {
              isLoading ?
                <>
                  {[...Array(8)].map((_, idx) =>
                    <Col key={`skeleton-loader-${params.category}-${idx}`} md={3}>
                      <div className='mb-2'>
                        <Skeleton height={300} />
                      </div>
                      <h5>
                        <Skeleton count={3} />
                      </h5>
                    </Col>
                  )}
                </>
                :
                product.data.length > 0 ?
                  product.data.map((product, idx) => <ProductCard data={product} key={idx} category={params.category}/>)
                  :
                  <div><h1>No product/s to show for {params.category}</h1></div>
            }
          </Row>
        </Container>
      </section>
    </main>
  )
}