'use client';

import { convertToPhCurrency } from '@/lib/convertToPHCurrency'

import {
  Container,
  Row,
  Col,
  Label,
  Input
} from 'reactstrap'
import { fetchParsed } from '@/lib/fetch-parsed'
import { useState } from 'react';

import Link from 'next/link'
import useSWR from 'swr'

import Skeleton from 'react-loading-skeleton';

export default function Page({ params }) {
  const [orderBy, setOrderBy] = useState({ key: 'creation', order: 'asc' });

  const { data: product, isLoading } = useSWR([`${window.location.origin}/api/product/list`, orderBy],
    ([url, order]) => fetchParsed(url, {
      method: 'POST',
      body: JSON.stringify({
        orderBy: order.key,
        order: order.order,
        limit: 20,
        search: [
          {
            field: 'category',
            operator: '==',
            searchterm: params.category
          }
        ]
      })
    }))

  return (
    <main className='bg-light'>
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
                  product.data.map((product, idx) => (
                    <Col md={3} key={idx} className='p-2'>
                      <div className='rounded border p-3' style={{background: 'white'}}>
                        <Link
                          className='text-reset text-decoration-none'
                          href={{
                            pathname: `/products/${product.id}`,
                            query: { category: params.category }
                          }}
                        >
                          <div className="product-item">
                            <div className='d-flex align-items-center justify-content-center product-image'>
                              <img src={product.thmburl.url} alt={product.thmburl.id} />
                            </div>
                            <h5 className='text-truncate'>{product.name.join(' ')}</h5>
                            <div className='flex-grow-1 d-flex justify-content-end'>
                              stars
                            </div>
                            <div className="d-flex">
                              <h5>{convertToPhCurrency(product.price)}</h5>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </Col>
                  ))
                  :
                  <div><h1>No product/s to show for {params.category}</h1></div>
            }
          </Row>
        </Container>
      </section>
    </main>
  )
}