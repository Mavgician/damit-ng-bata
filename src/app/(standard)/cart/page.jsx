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

export default function CartPage() {
  const { data: cartItems, isLoading } = useSWR(
    [`${window.location.origin}/api/user/cart`],
    ([url]) =>
      fetchParsed(url,
        {
          method: 'POST'
        }
      )
  )

  const [itemsTemp, setItemsTemp] = useState([]);

  const updateQuantity = (id, newQuantity) => {
    setItemsTemp(
      itemsTemp.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    )

    fetch(
      `${window.location.origin}/api/user/update-cart`,
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
      `${window.location.origin}/api/user/remove-cart`,
      {
        method: 'POST',
        body: JSON.stringify({
          id: id
        })
      }
    )
  }

  const calculateTotal = () => {
    return itemsTemp.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  useEffect(() => {
    if (!isLoading) {
      setItemsTemp(cartItems)
    }
  }, [isLoading]);

  return (
    <main>
      <Container>
        <Row className="my-4">
          <Col md="8">
            <h4 className="mb-4">Your cart</h4>
            {
              itemsTemp.length > 0 ? (
                itemsTemp.map(item => (
                  <div key={item.id} style={{ borderBottom: '1px solid #ccc', paddingBottom: '20px' }}>
                    <Row>
                      <Col md={1} className="d-flex align-items-center justify-content-center">
                        <FormGroup>
                          <Input type="checkbox" className="border-dark" style={{height: '25px', width: '25px'}}/>
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
                              item.type.map(type => <p className="m-0"><b>{type.key}:</b> {type.value}</p>)
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
                              style={{ padding: '0.5rem 3rem' }}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                ))

              ) : (
                <p>Your cart is empty.</p>
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
                <Link href={{
                  pathname: '/checkout',
                  query: {
                    amount: calculateTotal() + 50
                  }
                }}>
                  <Button color="primary" block className="my-3">
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
