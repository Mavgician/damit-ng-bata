'use client';

import { fetchParsed } from "@/src/lib/DataServer";
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
} from "reactstrap";
import useSWR from "swr";

import Link from "next/link";

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
                  <div key={item.id} className="d-flex mb-4" style={{ borderBottom: '1px solid #ccc', paddingBottom: '20px' }}>
                    <Link href={`${window.location.origin}/products/${item.id}`} className="d-inline">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        style={{ width: '120px', height: '120px', marginRight: '20px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    </Link>
                    <div style={{ flexGrow: 1 }}>
                      <h6>{item.name}</h6>
                      <p className="text-muted">{item.description}</p>
                      <p><strong>Size:</strong> {item.size}</p>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">Quantity:</span>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={e => updateQuantity(item.id, parseInt(e.target.value))}
                          style={{ width: '70px', marginLeft: '10px' }}
                        />
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
                    <h6 className="text-right" style={{ minWidth: '80px' }}>P{(item.price * item.quantity).toFixed(2)}</h6>
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
                  <span>P{calculateTotal().toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Estimated Shipping & Handling:</span>
                  <span>P50.00</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <strong>Total:</strong>
                  <strong>P{(calculateTotal() + 50).toFixed(2)}</strong>
                </div>
                <Button color="primary" block className="my-3">
                  Checkout
                </Button>
                <Button color="light" block style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/800px-PayPal.svg.png?20230314142951"
                    alt="PayPal"
                    style={{ width: '150px', height: '40px', marginRight: '8px' }}
                  />
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
}
