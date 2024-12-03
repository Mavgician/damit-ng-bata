'use client';

import { fetchParsed } from '@/lib/fetch-parsed'
import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  CardTitle,
  Input,
  FormGroup,
} from "reactstrap";
import useSWR from "swr";

import Link from "next/link";

import { convertToPhCurrency } from '@/lib/convertToPHCurrency';
import Skeleton from 'react-loading-skeleton';

export default function CartPage() {
  const { data: pending_order, isLoading } = useSWR('api/order/get-all-pending', fetchParsed)

  const [itemsTemp, setItemsTemp] = useState([]);

  const updateQuantity = (id, newQuantity) => {
    setItemsTemp(
      itemsTemp.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    )

    fetch(
      'api/order/update',
      {
        method: 'POST',
        body: JSON.stringify({
          id: id,
          quantity: newQuantity,
        })
      }
    )
  }

  const removeItem = (id) => {
    setItemsTemp(itemsTemp.filter(item => item.id != id));

    fetch(
      'api/order/update-status',
      {
        method: 'POST',
        body: JSON.stringify({
          id: id,
          status: 'cancelled'
        })
      }
    )
  }

  const calculateTotal = () => {
    return itemsTemp.reduce((acc, item) => item.is_checkout ? acc + item.price * item.quantity : acc + 0, 0);
  }

  const checkboxHandler = (id) => {
    setItemsTemp(
      itemsTemp.map((item) => {
        if (item.id === id) {
          fetch(
            'api/order/update',
            {
              method: 'POST',
              body: JSON.stringify({
                id: id,
                is_checkout: !item.is_checkout
              })
            }
          )

          return { ...item, is_checkout: !item.is_checkout }
        } else {
          return item
        }
      })
    )
  }

  useEffect(() => {
    if (!isLoading) {
      let items = []
      pending_order.data.forEach(item => {
        const product = item.product_ref.data

        items.push({
          id: item.id,
          name: product.name,
          description: product.description,
          price: product.price,
          imageUrl: product.thmburl.url,
          quantity: item.quantity,
          type: item.type,
          is_checkout: item.is_checkout
        })
      })
      setItemsTemp(items)
    }
  }, [isLoading]);
  
  return (
    <main>
      <Container>
        <Row className="my-4">
          <Col md="8">
            <h4 className="mb-4">Your cart</h4>
            {
              !isLoading ? (
                itemsTemp.length > 0 ?
                  itemsTemp.map(item => (
                    <div key={item.id} className='border-bottom my-4 pb-4'>
                      <Row>
                        <Col md={1} className="d-flex align-items-center justify-content-center">
                          <FormGroup>
                            <Input checked={item.is_checkout} onChange={() => checkboxHandler(item.id)} type="checkbox" className="border-dark" style={{ height: '25px', width: '25px' }} />
                          </FormGroup>
                        </Col>
                        <Col md={2}>
                          <Link href={`${window.location.origin}/products/${item.id}`}>
                            <img
                              src={item.imageUrl}
                              alt={item.name.join(' ')}
                              className="w-100"
                              style={{ objectFit: 'cover' }}
                            />
                          </Link>
                        </Col>
                        <Col>
                          <div>
                            <div className="d-flex">
                              <h6>{item.name.join(' ')}</h6>
                              <h6 className='ms-auto m-0 text-primary'>{convertToPhCurrency(item.price * item.quantity)}</h6>
                            </div>
                            <p className="text-muted">{item.description}</p>
                            <div className="d-flex gap-3 mb-3">
                              {
                                item.type.map(type => <p key={`${type.key}-${type.value}`} className="m-0"><b>{type.key}:</b> {type.value}</p>)
                              }
                            </div>
                            <div className="d-flex align-items-center justify-content-end">
                              <p className="me-2 mb-0">Quantity:</p>
                              <div className="flex-shrink-1">
                                <Input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={e => updateQuantity(item.id, parseInt(e.target.value))}
                                />
                              </div>
                            </div>
                            <div className="d-flex justify-content-between mt-3">
                              <Button
                                color="dark"
                                onClick={() => removeItem(item.id)}
                                className='px-5 py-2'
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  ))
                  :
                  <div>You have no items in your cart.</div>
              ) : (
                [...Array(3)].map((_, idx) => (
                  <div key={`skeleton-loader-cart-${idx}`} className='border-bottom my-4 pb-4'>
                    <Row>
                      <Col md={1}></Col>
                      <Col md={2}>
                        <Skeleton height={120}></Skeleton>
                      </Col>
                      <Col>
                        <div>
                          <Row>
                            <Col><Skeleton></Skeleton></Col>
                            <Col></Col>
                            <Col md={2}><Skeleton></Skeleton></Col>
                          </Row>
                          <Row>
                            <Col><Skeleton></Skeleton></Col>
                            <Col></Col>
                          </Row>
                          <Row className='mt-2'>
                            <Col md={2}><Skeleton></Skeleton></Col>
                          </Row>
                          <Row>
                            <Col></Col>
                            <Col md={3}><Skeleton height={33}></Skeleton></Col>
                          </Row>
                          <Row>
                            <Col md={4}><Skeleton height={33}></Skeleton></Col>
                            <Col></Col>
                          </Row>
                        </div>
                      </Col>
                    </Row>
                  </div>
                ))
              )}
          </Col>
          <Col md="4">
            <Card>
              <CardBody>
                <CardTitle tag="h5" className="mb-4">Summary</CardTitle>
                <div className="d-flex justify-content-between">
                  <span>Shipping:</span>
                  <span>Arrives Tue, Nov 5 - Fri, Nov 8</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Subtotal:</span>
                  <span>{convertToPhCurrency(calculateTotal())}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Estimated Shipping & Handling:</span>
                  <span>{convertToPhCurrency(50)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <strong>Total:</strong>
                  <strong>{convertToPhCurrency(calculateTotal() + 50)}</strong>
                </div>
                <Link className={calculateTotal() <= 0 && 'pe-none'} href={{
                  pathname: '/checkout',
                  query: {
                    amount: calculateTotal() + 50
                  }
                }}>
                  <Button disabled={calculateTotal() <= 0} color="primary" block className="my-3">
                    Checkout
                  </Button>
                </Link>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
}
