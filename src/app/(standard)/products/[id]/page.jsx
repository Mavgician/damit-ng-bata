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

import Link from 'next/link';

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
        className='product-carousel-control'
      />
      <CarouselControl
        direction="next"
        directionText="Next"
        onClickHandler={next}
        className='product-carousel-control'
      />
    </Carousel>
  )
}

function TypeButton({ data, keyname, onClick }) {
  const [active, setActive] = useState();

  let btns = []

  function btnHandler(type, idx) {
    if (active === idx) {
      onClick(`${keyname}-${type}-remove`)
      setActive(undefined)
    } else {
      onClick(`${keyname}-${type}`)
      setActive(idx)
    }
  }

  data.forEach((type, idx) => {
    const typename = Object.keys(type)[0]

    btns.push(
      <Button
        active={active === idx}
        key={`${keyname}-${idx}`}
        color="secondary"
        outline
        onClick={() => btnHandler(typename, idx)}>
        {typename}
      </Button>
    )
  })

  return btns
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

  const [type, setType] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);

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

  function typeHandler(t) {
    t = t.split('-')

    const payload = {
      key: t[0],
      value: t[1],
    }

    let types = [...type.filter(data => data.key != payload.key)]
    let newTypes = []

    if (t[2] == 'remove') {
      newTypes = types
    } else {
      newTypes = [payload, ...types]
    }

    if (newTypes.length === product.type.length) {
      setIsDisabled(false)
    } else {
      setIsDisabled(true)
    }

    setType(newTypes)
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
        <div className='text-secondary d-flex gap-2'>
          <Link className='text-reset text-decoration-none' href={'/shop'}>Categories</Link>
          &gt;
          <Link className='text-reset text-decoration-none' href={`/${product.category}`}>{product.category}</Link>
          &gt;
          <Link className='text-reset text-decoration-none' href={`/products/${product.id}`}>{product.name.join(' ')}</Link>
        </div>
        <div className="rounded shadow p-5 mt-3 bg-light">
          <Row>
            <Col md={6} className="image-section">
              <div>
                <ProductGallery images={product.carouselurls} />
              </div>
            </Col>

            <Col md={6}>
              <p className='fs-2'>{product.name.join(' ')}</p>
              <div className='d-flex justify-content-end'>
                Rating (0) [stars]
              </div>
              <h2 className='text-primary'>{Intl.NumberFormat('en-CA', { style: 'currency', currency: 'PHP' }).format(product.price)}</h2>
              <p className='mb-2 mt-4'><b>Item Description</b></p>
              <p>{product.description}</p>
              {
                product.type.map((key, idx) => {
                  const keyparent = Object.keys(key)[0]

                  return (
                    <div className='mb-3' key={`${idx}-${keyparent}`}>
                      <Row>
                        <Col md={1} className='d-flex align-items-center'>
                          <p className='m-0 fw-bold'>{keyparent}</p>
                        </Col>
                        <Col md={11}>
                          <div className='d-flex gap-1'>
                            <TypeButton data={key[keyparent]} keyname={keyparent} onClick={typeHandler} />
                          </div>
                        </Col>
                      </Row>
                    </div>
                  )
                })
              }
              <div className='d-flex align-items-center justify-content-end gap-1'>
                <Button disabled={isDisabled} color="success" onClick={addcartbtn}>Add to Cart</Button>
                <Button disabled={isDisabled} color="primary" onClick={buybtn}>Buy Now</Button>
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

      <section className="my-5">
        <Container>
          <div className='mb-4'>
            <h3>Suggested</h3>
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