'use client';

import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
  Carousel,
  CarouselItem,
  CarouselControl,
  Input
} from 'reactstrap';

import { RateButton } from '@/components/RateButton'

import { fetchParsed } from '@/lib/fetch-parsed'
import { useState } from 'react';
import { convertToPhCurrency } from '@/src/lib/convertToPHCurrency';

import useSWR from 'swr';

import InnerImageZoom from 'react-inner-image-zoom';
import '@/lib/react-innner-image-zoom.min.css'

import Link from 'next/link';
import useRouter from '@/lib/custom-useRouter';


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
  const { data: product, isLoading: isProductLoading } = useSWR(
    ['/api/product/item'],
    ([url]) => fetchParsed(url, {
      method: 'POST',
      body: JSON.stringify({
        id: params.id
      })
    }
    ))

  const { data: reviews, isLoading: isReviewsLoading } = useSWR(
    ['/api/review/get-all'],
    ([url]) => fetchParsed(url, {
      method: 'POST',
      body: JSON.stringify({
        id: params.id
      })
    })
  )

  const { data: ratingAverage, isLoading: isRatingAverageLoading } = useSWR(
    ['/api/review/get-average'],
    ([url]) => fetchParsed(url, {
      method: 'POST',
      body: JSON.stringify({
        id: params.id
      })
    })
  )
  
  console.log(ratingAverage);
  

  const [type, setType] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const [isDisabled, setIsDisabled] = useState(true);

  const router = useRouter()

  function addcartbtn() {
    fetch(
      '/api/order/create',
      {
        method: 'POST',
        body: JSON.stringify({
          product_id: params.id,
          quantity: quantity,
          type: type,
          amount: product.price * quantity
        })
      }
    )
  }

  async function buybtn() {
    const { id } = await (await fetch('/api/order/create', {
      method: 'POST',
      body: JSON.stringify({
        product_id: params.id,
        quantity: quantity,
        type: type,
        amount: product.price * quantity,
        is_checkout: true,
        is_buying: true,
      })
    })).json()

    router.push({
      pathname: '/checkout',
      query: {
        amount: product.price * quantity,
        order_id: id,
        type: JSON.stringify(type),
        quantity: quantity,
        is_buying: true
      }
    })
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

  if (isProductLoading) {
    return (
      <div>
        <Spinner></Spinner>
      </div>
    )
  }

  return (
    <main className='bg-light py-4'>
      <Container className="p-3">
        <div className='text-secondary d-flex gap-2'>
          <Link className='text-reset text-decoration-none' href={'/shop'}>Categories</Link>
          &gt;
          <Link className='text-reset text-decoration-none' href={`/category/${product.category}`}>{product.category}</Link>
          &gt;
          <Link className='text-reset text-decoration-none' href={`/products/${product.id}`}>{product.name.join(' ')}</Link>
        </div>
        <div className="mt-3 p-5 border rounded" style={{ background: 'white' }}>
          <Row>
            <Col md={6} className="image-section">
              <div>
                <ProductGallery images={product.carouselurls} />
              </div>
            </Col>

            <Col md={6}>
              <p className='fs-2'>{product.name.join(' ')}</p>
              <div className='d-flex justify-content-end'>
                Rating ({!isReviewsLoading ? reviews.count : 0})
                <RateButton value={1} rate={!isRatingAverageLoading ? ratingAverage.average : 0} selectable={false} />
                <RateButton value={2} rate={!isRatingAverageLoading ? ratingAverage.average : 0} selectable={false} />
                <RateButton value={3} rate={!isRatingAverageLoading ? ratingAverage.average : 0} selectable={false} />
                <RateButton value={4} rate={!isRatingAverageLoading ? ratingAverage.average : 0} selectable={false} />
                <RateButton value={5} rate={!isRatingAverageLoading ? ratingAverage.average : 0} selectable={false} />
              </div>
              <h2 className='text-primary'>{convertToPhCurrency(product.price)}</h2>
              <p className='mb-2 mt-4'><b>Item Description</b></p>
              <p>{product.description}</p>
              {
                product.type.map((key, idx) => {
                  const keyparent = Object.keys(key)[0]

                  return (
                    <div className='mb-3' key={`${idx}-${keyparent}`}>
                      <Row>
                        <Col md={2} className='d-flex align-items-center'>
                          <p className='m-0 fw-bold'>{keyparent}</p>
                        </Col>
                        <Col md={10}>
                          <div className='d-flex gap-1'>
                            <TypeButton data={key[keyparent]} keyname={keyparent} onClick={typeHandler} />
                          </div>
                        </Col>
                      </Row>
                    </div>
                  )
                })
              }
              <div className='mb-3'>
                <Row>
                  <Col md={2} className='d-flex align-items-center'>
                    <p className='m-0 fw-bold'>Quantity</p>
                  </Col>
                  <Col md={10}>
                    <div className='w-25'><Input value={quantity} onChange={e => setQuantity(Number(e.target.value))} max={10} type='number' /></div>
                  </Col>
                </Row>
              </div>
              <div className='d-flex align-items-center justify-content-end gap-1'>
                <Button disabled={isDisabled} color="success" onClick={addcartbtn}>Add to Cart</Button>
                <Button disabled={isDisabled} color="primary" onClick={buybtn}>Buy Now</Button>
              </div>
            </Col>
          </Row>
        </div>
        <div className="mt-3 p-5 border rounded mb-5" style={{ background: 'white' }}>
          <h3 className='mb-3'>Customer Reviews ({!isReviewsLoading ? reviews.count : 0}) </h3>
          {
            !isReviewsLoading && reviews?.data.map(review => (
              <>
                <div className='border rounded p-3 mb-2'>
                  <div className='d-flex mb-2 align-items-center'>
                    <p className='fw-bold m-0'>{review.customer_ref.data.name.display}</p>
                    <div className='ms-auto d-flex justify-content-end'>
                      <RateButton value={1} rate={review.rating} selectable={false} />
                      <RateButton value={2} rate={review.rating} selectable={false} />
                      <RateButton value={3} rate={review.rating} selectable={false} />
                      <RateButton value={4} rate={review.rating} selectable={false} />
                      <RateButton value={5} rate={review.rating} selectable={false} />
                    </div>
                  </div>
                  <p className='text-secondary m-0'>
                    {
                      review.text.length > 0 ? review.text : <i>no content</i>
                    }
                  </p>
                </div>
              </>
            ))
          }
        </div>
      </Container>
    </main>
  );
}