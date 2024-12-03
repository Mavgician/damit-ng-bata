'use client'

import Link from 'next/link';

import {
  Button,
  Row,
  Col
} from 'reactstrap'

import { fetchParsed } from '@/lib/fetch-parsed'
import { convertToPhCurrency } from '@/src/lib/convertToPHCurrency';

import useSWR from 'swr';
import { useEffect, useState } from 'react';

export function Orders() {
  const { data: orders, isLoading: isOrdersLoading } = useSWR('api/order/get-all-payed', fetchParsed)
  const { data: reviews, isLoading: isReviewsLoading } = useSWR('api/review/get-all', fetchParsed)

  const [reviewIds, setReviewIds] = useState([]);

  useEffect(() => {
    if (!isReviewsLoading) {
      setReviewIds(reviews.data.reduce((ids, obj) => {
        ids.push(obj.product_ref.id)
        return ids
      }, []))
    }
  }, [reviews])

  return (
    <>
      <p className='fs-3'>My Orders ({orders?.count ?? 0})</p>
      {
        !isOrdersLoading && !isReviewsLoading ?
          orders.count > 0 ?
            <>
              {orders.data.map(order => {
                const product = order.product_ref.data
                let statusPill = 'bg-'

                switch (order.status) {
                  case 'cancelled':
                    statusPill += 'danger'
                    break;

                  case 'pending':
                    statusPill += 'warning'
                    break;

                  case 'success':
                    statusPill += 'success'
                    break;

                  default:
                    statusPill += 'secondary'
                    break;
                }

                return (
                  <div key={order.id} className='p-4 border mb-3 rounded' style={{ background: 'white' }}>
                    <div className="d-flex align-items-center">
                      <h5 className='text-uppercase m-0'>
                        {product.category}
                      </h5>
                      <div className={`ms-auto m-0 px-3 py-1 d-inline text-light ${statusPill} rounded-pill`}>{order.status}</div>
                    </div>
                    <hr />
                    <Row className='position-relative'>
                      <Col md={2} className='px-2 mt-3'>
                        <Link href={`${window.location.origin}/products/${order.product_ref.id}`}>
                          <img
                            src={product.thmburl.url}
                            alt={product.name.join(' ')}
                            className="w-100 rounded"
                            style={{ objectFit: 'cover' }}
                          />
                        </Link>
                      </Col>
                      <Col md={10} className='px-2 mt-3'>
                        <Row>
                          <Col md={12}>
                            <Row>
                              <Col md={6}>
                                <p className='text-truncate mb-1'>{product.name.join(' ')}</p>
                              </Col>
                              <Col md={2}>
                                <p className='mb-1'>{convertToPhCurrency(product.price)}</p>
                              </Col>
                              <Col md={2}>
                                <p className='mb-1'><span className="text-secondary">Qty:</span> {order.quantity}</p>
                              </Col>
                              <Col md={2}></Col>
                              <Col md={12}>
                                {
                                  order.type.map(type => (
                                    <p key={`${type.key}-${type.value}`} className="m-0">
                                      <span className='text-secondary'>{type.key}:</span> {type.value}
                                    </p>
                                  ))
                                }
                              </Col>
                            </Row>
                          </Col>
                          <div className='mt-5'>
                            {
                              !reviewIds.includes(order.product_ref.id) ?
                                <Link href={`products/review/${order.product_ref.id}`}>
                                  <Button size='sm' color='primary'>
                                    Write a review
                                  </Button>
                                </Link>
                                :
                                <Button disabled size='sm' color='secondary'>
                                  You already wrote a review.
                                </Button>
                            }
                          </div>
                        </Row>
                      </Col>
                    </Row>
                  </div>
                )
              })}
            </>
            :
            <div>There are no orders yet</div>
          :
          <div>Loading</div>
      }
    </>
  )
}