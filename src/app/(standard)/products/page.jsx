'use client';

import { Container, Row, Col, Button } from 'reactstrap';

export default function Page() {
  return (
    <main>
      <Container className="product-page">
        <div className="product-box">
          <Row>
            <Col md={6} className="image-section">
              <img 
                src="https://www.myperiwinkle.com/cdn/shop/files/ginee_20240927172405537_2293938909.png?v=1727429109&width=3000" 
                alt="Main Product" 
                className="main-image"
              />
              <div className="thumbnail-images">
                <img 
                  src="https://www.myperiwinkle.com/cdn/shop/files/ginee_20240927172409270_1110767406.png?v=1727429114&width=3000" 
                  alt="Thumbnail 1" 
                  className="thumbnail" 
                />
                <img 
                  src="https://www.myperiwinkle.com/cdn/shop/files/ginee_20240927172412595_2613174516.png?v=1727429118&width=3000" 
                  alt="Thumbnail 2" 
                  className="thumbnail" 
                />
                <img 
                  src="https://www.myperiwinkle.com/cdn/shop/files/ginee_20240927172433156_7082188409.png?v=1727429122&width=3000" 
                  alt="Thumbnail 3" 
                  className="thumbnail" 
                />
                <img 
                  src="https://www.myperiwinkle.com/cdn/shop/files/ginee_20240927172433156_7082188409.png?v=1727429122&width=3000" 
                  alt="Thumbnail 4" 
                  className="thumbnail" 
                />
              </div>
            </Col>
            
            <Col md={6} className="details-section">
              <h2>Isaac Baby Boy Red Shirt and Shorts Set</h2>
              <h4>₱1,099.00</h4>
              <p>Description of the product goes here. It should provide essential details that attract customers.</p>
              <h5>Sizes:</h5>
              <div className="size-buttons">
                <Button color="secondary" className="size-button">Small</Button>
                <Button color="secondary" className="size-button">Medium</Button>
                <Button color="secondary" className="size-button">Large</Button>
              </div>
              <div className="action-buttons">
                <Button color="primary" className="buy-button">Buy Now</Button>
                <Button color="success" className="cart-button">Add to Cart</Button>
              </div>
            </Col>
          </Row>
        </div>

        <div className="reviews-section">
          <h3>Customer Reviews</h3>
          {[1, 2, 3, 4].map((review, index) => (
            <div key={index} className="review-box">
              <div className="review-header">
                <span className="customer-name">Customer {index + 1}</span>
                <span className="stars">⭐⭐⭐⭐⭐</span>
              </div>
              <p className="review-comment">This is a great product! I really love it. Highly recommended!</p>
            </div>
          ))}
        </div>
      </Container>

      <section className="related-products">
        <Container>
          <div className="related-products-banner d-flex justify-content-center">
            <h2>Related Products</h2>
          </div>
          <Row>
            <Col md={4}>
 
              <div className="related-product">
                <img src="https://www.myperiwinkle.com/cdn/shop/files/ginee_20240927172409270_1110767406.png?v=1727429114&width=480" alt="Product 1" />
                <h3>Product 1</h3>
                <p>Description of Product 1</p>
              </div>
            </Col>
            <Col md={4}>

              <div className="related-product">
                <img src="https://www.myperiwinkle.com/cdn/shop/files/ginee_20240927172409270_1110767406.png?v=1727429114&width=480" alt="Product 2" />
                <h3>Product 2</h3>
                <p>Description of Product 2</p>
              </div>
            </Col>
            <Col md={4}>

              <div className="related-product">
                <img src="https://www.myperiwinkle.com/cdn/shop/files/ginee_20240927172409270_1110767406.png?v=1727429114&width=480" alt="Product 3" />
                <h3>Product 3</h3>
                <p>Description of Product 3</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <style jsx>{`
        .product-page {
          padding: 2rem;
        }
        .main-image {
          width: 100%;
          height: auto;
          margin-bottom: 1rem;
        }
        .thumbnail-images {
          display: flex;
          justify-content: space-between;
        }
        .thumbnail {
          width: 23%;
          height: auto;
          cursor: pointer;
        }
        .details-section {
          padding-left: 2rem;
        }
        .product-box {
          padding: 1.5rem;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          margin-top: 1rem; 
        }
        .size-buttons {
          display: flex;
          margin: 1rem 0;
          gap: 1rem;
        }
        .action-buttons {
          display: flex;
          justify-content: flex-end; 
          margin-top: 1rem;
        }
        .buy-button, .cart-button {
          margin-left: 0.5rem;
        }
        .reviews-section {
          margin-top: 2rem;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .review-box {
          padding: 1rem;
          border-bottom: 1px solid #eaeaea;
        }
        .review-box:last-child {
          border-bottom: none; 
        }
        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .customer-name {
          font-weight: bold;
        }
        .stars {
          color: gold; /* Star color */
        }
        .review-comment {
          margin-top: 0.5rem;
          color: #555; 
        }



        .related-products {
          padding: 2rem 0;
        }
        .related-products-banner {
          margin-bottom: 2rem;
        }
        .related-products-banner h2 {
          font-size: 2.5rem;
          font-weight: bold;
        }
        .related-product {
          text-align: center;
          margin-bottom: 2rem;
        }
        .related-product img {
          max-width: 100%;
          height: auto;
          margin-bottom: 10px;
        }
      `}</style>
    </main>
  );
}