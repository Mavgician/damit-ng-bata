'use client'

import { getStripe } from '@/lib/get-stripe'
import { convertToSubCurrency } from '@/lib/convertToSubcurrency'

import { Elements } from '@stripe/react-stripe-js'
import { useSearchParams } from 'next/navigation'

import { CheckoutPage } from '@/components/Checkout'
import { Container, Row, Col, Button } from 'reactstrap'
import { convertToPhCurrency } from '@/lib/convertToPHCurrency'
import { createContext, useEffect, useState } from 'react'

import Skeleton from 'react-loading-skeleton'

const stripe = getStripe()
const OrderContext = createContext(null)

export default function Page() {
  const query = useSearchParams()
  const amount = Number(query.get('amount'))

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true)
    if (query.get('is_buying')) {
      fetch('/api/order/get', {
        method: 'POST',
        body: JSON.stringify({ id: query.get('order_id') })
      })
        .then(res => res.json())
        .then(data => {
          setOrders([data])
          setIsLoading(false)
        })
    } else {
      fetch('api/order/get-all-checkout')
        .then(res => res.json())
        .then(data => {
          setOrders(data.data)
          setIsLoading(false)
        })
    }
  }, []);

  return (
    <main className="min-vh-100 py-5 d-flex justify-content-center align-items-center">
      <Container>
        <Row>
          <Col md={6}>
            <h2 className='m-0'>You are about to pay Damit ng Bata</h2>
            <h1 className='m-0 text-primary' style={{ fontSize: '4em' }}>{convertToPhCurrency(amount)}</h1>
            {
              isLoading ?
                <>
                  <div className='my-4'>
                    <Row>
                      <Col md={4}><Skeleton></Skeleton></Col>
                      <Col md={6} ></Col>
                      <Col md={2}><Skeleton></Skeleton></Col>
                    </Row>
                    <Skeleton />
                    <Row>
                      <Col md={2}><Skeleton></Skeleton></Col>
                      <Col md={8} ></Col>
                      <Col md={2}><Skeleton></Skeleton></Col>
                    </Row>
                    <hr />
                  </div>
                  <div className='my-4'>
                    <Row>
                      <Col md={4}><Skeleton></Skeleton></Col>
                      <Col md={6} ></Col>
                      <Col md={2}><Skeleton></Skeleton></Col>
                    </Row>
                    <Skeleton />
                    <Row>
                      <Col md={2}><Skeleton></Skeleton></Col>
                      <Col md={8} ></Col>
                      <Col md={2}><Skeleton></Skeleton></Col>
                    </Row>
                    <hr />
                  </div>
                  <div>
                    <Row>
                      <Col md={2}><Skeleton></Skeleton></Col>
                      <Col md={8}></Col>
                      <Col md={2}><Skeleton></Skeleton></Col>
                    </Row>
                    <hr />
                  </div>
                </>
                :
                <>
                  {
                    orders.map(order => (
                      <div className='my-4'>
                        <div className="d-flex">
                          <p className='m-0'>{order.product_ref.data.name.join(' ')}</p>
                          <p className='m-0 flex-grow-1 text-end'>{convertToPhCurrency(order.product_ref.data.price * order.quantity)}</p>
                        </div>
                        <p className='m-0 text-secondary '>{order.product_ref.data.description}</p>
                        <div className="d-flex">
                          <p className='m-0 text-secondary'>Qty {order.quantity}</p>
                          {order.quantity > 1 && <p className='m-0 text-secondary flex-grow-1 text-end'>{convertToPhCurrency(order.product_ref.data.price)} each</p>}
                        </div>
                        <hr />
                      </div>
                    ))
                  }
                  <div className='my-4'>
                    <div className="d-flex">
                      <p className='m-0'>Shipping fee</p>
                      <p className='m-0 flex-grow-1 text-end'>{convertToPhCurrency(50)}</p>
                    </div>
                    <hr />
                  </div>
                </>
            }

          </Col>
          <Col md={6}>
            <div className='border rounded p-4'>
              <OrderContext.Provider value={{ orders: orders }}>
                <Elements
                  stripe={stripe}
                  options={{
                    mode: 'payment',
                    amount: convertToSubCurrency(amount),
                    currency: 'php',
                  }}
                >
                  <CheckoutPage amount={amount} context={OrderContext} isLoading={isLoading}/>
                </Elements>
              </OrderContext.Provider>
            </div>
          </Col>
        </Row>
      </Container>
    </main>
  )
}