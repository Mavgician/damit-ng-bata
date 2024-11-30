'use client'

import {
  Container,
  Row,
  Col,
  Button
} from 'reactstrap'

import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <div>
        <div className="image-container mb-5">
          <img src="https://www.myperiwinkle.com/cdn/shop/files/4G1A6513.jpg?v=1728365013&width=1950" alt="" />
        </div>
        <Container className='mb-5'>
          <Row>
            <Col md={6}>
              <h1 className='fw-normal mb-3'>Your first stop to fabulous childrens' fashion.</h1>
              <Link href='/'><Button color='light rounded-pill'>Explore Now</Button></Link>
            </Col>
            <Col md={6} className='position-relative'>
              <div className='position-absolute bottom-0 end-0 w-75'>
                <p className='m-0'>
                  <i>Explore our curated selection of childrens' clothing. Where simplicity meets elegance, giving your children comfort and style.</i>
                </p>
              </div>
            </Col>
          </Row>
        </Container>
        <Container className='mb-5'>
          <Row>
            <Col md={6}>
              <Link href='/'><img className='w-100 h-100' src="https://www.myperiwinkle.com/cdn/shop/files/4G1A6513.jpg?v=1728365013&width=1950" alt="" /></Link>
            </Col>
            <Col md={6}>
              <Link href='/'><img className='w-100 h-100' src="https://www.myperiwinkle.com/cdn/shop/files/4G1A6513.jpg?v=1728365013&width=1950" alt="" /></Link>
            </Col>
            <Col className='my-3' md={12}>
              <Link href='/'><img className='w-100 h-100' src="https://www.myperiwinkle.com/cdn/shop/files/4G1A6513.jpg?v=1728365013&width=1950" alt="" /></Link>
            </Col>
          </Row>
        </Container>
      </div>
    </main>
  );
}