'use client';

import React, { useState } from "react";
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

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Emré Baby Boy White Blue Christening Romper Set",
      description: "Sample Description",
      size: ' M', 
      price: 1500,
      quantity: 1,
      imageUrl: "https://www.myperiwinkle.com/cdn/shop/files/ginee_20241015180455104_6714835123.png?v=1728986897",
    },
    {
      id: 2,
      name: "Isaac Baby Boy Red Shirt and Shorts Set",
      description: "Sample Description",
      size: ' M', 
      price: 1350,
      quantity: 1,
      imageUrl: "https://www.myperiwinkle.com/cdn/shop/files/ginee_20240927172405537_2293938909.png?v=1727429109",
    },
    {
      id: 3,
      name: "Donnie Baby Boy Light Blue Printed Polo and Shorts Set",
      description: "Sample Description",
      size: ' L', 
      price: 1920,
      quantity: 1,
      imageUrl: "https://www.myperiwinkle.com/cdn/shop/files/ginee_20240927153018696_3621042018.png?v=1727422269",
    }
  ]);

  const updateQuantity = (id, newQuantity) => {
    setCartItems(
      cartItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  const removeItem = id => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  return (
    <Container>
      <Row className="my-4">
        {/* Left Side: Bag */}
        <Col md="8">
          <h4 className="mb-4">Bag</h4>
          {cartItems.length > 0 ? (
            cartItems.map(item => (
              <div key={item.id} className="d-flex mb-4" style={{ borderBottom: '1px solid #ccc', paddingBottom: '20px' }}>
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  style={{ width: '120px', height: '120px', marginRight: '20px', objectFit: 'cover', borderRadius: '8px' }}
                />
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

        {/* Right Side: Summary */}
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
  );
}
