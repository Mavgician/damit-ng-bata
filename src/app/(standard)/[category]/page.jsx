'use client';

import { Container, Row, Col, Spinner } from 'reactstrap'
import { fetchParsed } from '@/src/lib/DataServer'

import Link from 'next/link'
import useSWR from 'swr'

export default function Page({ params }) {
  const { data: product, isLoading } = useSWR(['api/product/list'],
    ([url]) => fetchParsed(url, {
      method: 'POST',
      body: JSON.stringify({
        order: 'creation',
        limit: 10,
        category: params.category
      })
    }))

  if (isLoading) {
    return <div className='vh-100 d-flex justify-content-center align-items-center'><Spinner size='lg'></Spinner></div>
  }

  if (product?.data.length === 0) {
    return <div className='vh-100 d-flex justify-content-center align-items-center'><h1>No product/s to show for {params.category}</h1></div>
  }

  return (
    <main>
      <section className="banner">
        <div className="banner-content">
          <h1 className="banner-title">{params.category.toUpperCase()}</h1>
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

      {
        isLoading ?
          <Spinner />
          :
          <section className="product-grid">
            <Container>
              <Row>
                {
                  product.data.length > 0 && product.data.map((product, idx) => (
                    <Col xs={6} md={4} lg={3} key={idx}>
                      <Link className='text-reset text-decoration-none' href={`/products/${product.id}`}>
                        <div className="product-item">
                          <div className='d-flex align-items-center justify-content-center product-image'>
                            <img src={product.thmburl.url} alt={product.thmburl.id} />
                          </div>
                          <h3>{product.name}</h3>
                          <p>{product.description}</p>
                        </div>
                      </Link>
                    </Col>
                  ))
                }
              </Row>
            </Container>
          </section>
      }
    </main>
  );
}