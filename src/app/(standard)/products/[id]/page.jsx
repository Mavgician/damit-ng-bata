'use client';

import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
  Carousel,
  CarouselItem,
  CarouselControl
} from 'reactstrap';

import { fetchParsed } from '@/src/lib/DataServer';
import { useState, useEffect } from 'react';

import useSWR from 'swr';

import InnerImageZoom from 'react-inner-image-zoom';
import '@/lib/react-innner-image-zoom.min.css'

function ProductGallery({ images }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  let slideid = [], slidesrc = []

  for (let i = 0; i < images.length; i++) {
    slidesrc.push(images[i].url)
    slideid.push(images[i].id)
  }

  slidesrc.forEach((src, idx) => slidesrc[idx] =
    <CarouselItem
      onExiting={() => setAnimating(true)}
      onExited={() => setAnimating(false)}
      key={slideid[idx]}
    >
      <div className='box-aspect'>
        <InnerImageZoom src={src} zoomScale={2} height={1045} width={1000} hasSpacer={true} zoomType='hover' />
      </div>
    </CarouselItem>
  )

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === slidesrc.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? slidesrc.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  return (
    <Carousel
      activeIndex={activeIndex}
      next={next}
      previous={previous}
      interval={false}
      style={{ height: 630 }}
      className='d-flex align-items-center'
    >
      {slidesrc}
      <CarouselControl
        direction="prev"
        directionText="Previous"
        onClickHandler={previous}
      />
      <CarouselControl
        direction="next"
        directionText="Next"
        onClickHandler={next}
      />
    </Carousel>
  )
}

export default function Page({ params }) {
  const { data: product, isLoading } = useSWR(
    [`${window.location.origin}/api/product/item`],
    ([url]) => fetchParsed(url, {
      method: 'POST',
      body: JSON.stringify({
        id: params.id
      })
    }
    ))

  const [type, setType] = useState(0);

  function addcartbtn() {
    fetch(
      `${window.location.origin}/api/user/add-cart`,
      {
        method: 'POST',
        body: JSON.stringify({
          id: params.id,
          quantity: 1,
          type: type
        })
      }
    )
  }

  function buybtn() {

  }

  if (isLoading) {
    return (
      <div>
        <Spinner></Spinner>
      </div>
    )
  }

  return (
    <main>
      <Container className="p-3">
        <div className="rounded shadow p-5 mt-3 bg-light">
          <Row>
            <Col md={6} className="image-section">
              <div>
                <ProductGallery images={product.carouselurls} />
              </div>
            </Col>

            <Col md={6}>
              <h2>{product.name}</h2>
              <h4>{product.price}</h4>
              <p>{product.desription}</p>
              {
                product.type.map((type, idx) => {
                  const keyparent = Object.keys(type)[0]

                  return <div key={`${idx}-${keyparent}`}>
                    <h5>{keyparent}:</h5>
                    <div className='d-flex gap-1'>
                      {
                        type[keyparent].map((typename, indx) => {
                          const keychild = Object.keys(typename)[0]
                          return <Button key={`${indx}-${keychild}`} onClick={() => setType(indx)} color="secondary">{keychild}</Button>
                        })
                      }
                    </div>
                  </div>
                })
              }
              <div className='d-flex align-items-center justify-content-end gap-1'>
                <Button color="success" onClick={addcartbtn}>Add to Cart</Button>
                <Button color="primary">Buy Now</Button>
              </div>
            </Col>
          </Row>
        </div>

        <div className="mt-3 p-5 shadow rounded bg-light">
          <h3>Customer Reviews</h3>
          {[1, 2, 3, 4].map((review, index) => (
            <div key={index} className="p-2">
              <div className="d-flex">
                <span><b>Customer {index + 1}</b></span>
                <span className="flex-grow-1 d-flex justify-content-end">⭐⭐⭐⭐⭐</span>
              </div>
              <p className="mt-2 text-secondary">This is a great product! I really love it. Highly recommended!</p>
              <hr className='m-0' />
            </div>
          ))}
        </div>
      </Container>

      <section className="mt-5">
        <Container>
          <div className="d-flex justify-content-center mb-3">
            <h1>Related Products</h1>
          </div>
          <Row>
            <Col md={4}>

              <div className="text-center mb-3">
                <img className='w-100 mb-3' src="https://www.myperiwinkle.com/cdn/shop/files/ginee_20240927172409270_1110767406.png?v=1727429114&width=480" alt="Product 1" />
                <h3>Product 1</h3>
                <p>Description of Product 1</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
}