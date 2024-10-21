'use client';

import { Container, Row, Col } from 'reactstrap';
import Link from 'next/link';

export default function Page() {
  return (
    <main>
      <section className="banner">
        <div className="banner-content">
          <h1 className="banner-title">BOYS</h1>
        </div>
      </section>

      <section className="featured-products">
        <Container>
          <div className="featured-products-banner d-flex justify-content-center">
            <h2>Featured Products</h2>
          </div>
          <Row>
            <Col md={4}>
              <div className="featured-product">
                <Link href="/products">
                  <img src="https://www.myperiwinkle.com/cdn/shop/files/ginee_20240927172409270_1110767406.png?v=1727429114&width=480" alt="Product 1" />
                </Link>
                <h3>Product 1</h3>
                <p>Description of Product 1</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="featured-product">
                <Link href="/products">
                  <img src="https://www.myperiwinkle.com/cdn/shop/files/ginee_20240927172409270_1110767406.png?v=1727429114&width=480" alt="Product 2" />
                </Link>
                <h3>Product 2</h3>
                <p>Description of Product 2</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="featured-product">
                <Link href="/products">
                  <img src="https://www.myperiwinkle.com/cdn/shop/files/ginee_20240927172409270_1110767406.png?v=1727429114&width=480" alt="Product 3" />
                </Link>
                <h3>Product 3</h3>
                <p>Description of Product 3</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="banner">
        <div className="banner-content">
          <h1 className="banner-title">PROMOTIONAL PRODUCTS</h1>
        </div>
      </section>

      <section className="product-grid">
        <Container>
          <Row>
            {Array.from({ length: 24 }).map((_, index) => (
              <Col xs={6} md={4} lg={3} key={index}>
                <div className="product-item">
                  <Link href="/products">
                    <img src="https://www.myperiwinkle.com/cdn/shop/files/ginee_20240927172409270_1110767406.png?v=1727429114&width=480" alt={`Product ${index + 1}`} />
                  </Link>
                  <h3>Product {index + 1}</h3>
                  <p>Description of Product {index + 1}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <style jsx>{`
        .banner {
          position: relative;
          width: 100%;
          height: 95vh;
          background-image: url('https://images.pexels.com/photos/1564828/pexels-photo-1564828.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1');
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        .banner-content {
          text-align: center;
        }

        .featured-products {
          padding: 2rem 0;
        }
        .featured-products-banner {
          margin-bottom: 2rem;
        }
        .featured-products-banner h2 {
          font-size: 2.5rem;
          font-weight: bold;
        }
        .featured-product {
          text-align: center;
          margin-bottom: 2rem;
        }
        .featured-product img {
          max-width: 100%;
          height: auto;
          margin-bottom: 10px;
          transition: transform 0.3s ease;
        }
        .featured-product img:hover {
          transform: scale(1.05);
        }

        .product-grid {
          padding: 2rem 0;
        }
        .product-item {
          text-align: center;
          margin-bottom: 2rem;
        }
        .product-item img {
          max-width: 100%;
          height: auto;
          margin-bottom: 10px;
          transition: transform 0.3s ease;
        }
        .product-item img:hover {
          transform: scale(1.05);
        }

        .banner-title {
          font-weight: bold;
          font-size: 8rem;
          font-style: italic;
        }
        
        .banner::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5); 
          z-index: 1; 
        }

        .banner-content {
          position: relative;
          z-index: 2;
        }
      `}</style>
    </main>
  );
}
