'use client';

import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
  FormGroup,
  Label,
  Input
} from 'reactstrap';

import { RateButton } from '@/components/RateButton'

import { useEffect, useState } from 'react';

import { fetchParsed } from '@/lib/fetch-parsed'
import { useRouter } from 'next/navigation';

import useSWR from 'swr'
import Link from 'next/link'

export default function Page({ params }) {
  const { data: product, isLoading: productLoading } = useSWR(
    ['/api/product/item'],
    ([url]) => fetchParsed(url, {
      method: 'POST',
      body: JSON.stringify({
        id: params.id
      })
    })
  )

  const { data: user, isLoading: userLoading } = useSWR(
    ['/api/user/verify'],
    ([url]) => fetchParsed(url, { method: 'POST' }
    )
  )

  const [rate, setRate] = useState(0)
  const [description, setDescription] = useState('')

  const [disabled, setDisabled] = useState(true);

  const router = useRouter()

  async function submitHandler() {
    await fetch('/api/review/create', {
      method: 'POST',
      body: JSON.stringify({
        product_id: params.id,
        rating: rate,
        review: description
      })
    })

    router.back()
  }

  useEffect(() => {
    if (rate > 0) {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }, [description, rate]);

  if (productLoading) {
    return (
      <div>
        <Spinner></Spinner>
      </div>
    )
  }

  return (
    <main className='bg-light'>
      <Container className="p-3">
        <div className='text-secondary d-flex gap-2'>
          <Link className='text-reset text-decoration-none' href={'/profile'}>Profile</Link>
          &gt;
          <Link className='text-reset text-decoration-none' href={`/profile`}>Product Review</Link>
          &gt;
          <Link className='text-reset text-decoration-none' href={`/products/${product.id}`}>{product.name.join(' ')}</Link>
        </div>
        <Row className='mt-3'>
          <Col md={6}>
            <div className="border rounded px-5 pt-4 pb-5" style={{ background: 'white' }}>
              <p className='fs-4 text-secondary m-0'>Writing a review for</p>
              <h3>{product.name.join(' ')}</h3>
              <div className='d-flex justify-content-end my-3'>
                <RateButton value={1} rate={rate} onClick={setRate} />
                <RateButton value={2} rate={rate} onClick={setRate} />
                <RateButton value={3} rate={rate} onClick={setRate} />
                <RateButton value={4} rate={rate} onClick={setRate} />
                <RateButton value={5} rate={rate} onClick={setRate} />
              </div>
              <FormGroup>
                <Label>Write your review</Label>
                <Input type='textarea' style={{ height: 200 }} value={description} onChange={(e) => setDescription(e.target.value)} />
              </FormGroup>
              <Button disabled={disabled} onClick={submitHandler}>Submit</Button>
            </div>
          </Col>
          <Col md={6}>
            <div className="border rounded px-5 py-4 mb-3" style={{ background: 'white' }}>
              <p className='text-secondary m-0 mb-3'>What your review will look like</p>
              {
                !userLoading &&
                <div className='border rounded p-3'>
                  <div className='d-flex mb-2 align-items-center'>
                    <p className='fw-bold m-0'>{user.name.display}</p>
                    <div className='ms-auto d-flex justify-content-end'>
                      <RateButton value={1} rate={rate} selectable={false} />
                      <RateButton value={2} rate={rate} selectable={false} />
                      <RateButton value={3} rate={rate} selectable={false} />
                      <RateButton value={4} rate={rate} selectable={false} />
                      <RateButton value={5} rate={rate} selectable={false} />
                    </div>
                  </div>
                  <p className='text-secondary m-0'>
                    {
                      description.length > 0 ? description : <i>no content</i>
                    }
                  </p>
                </div>
              }
            </div>
          </Col>
        </Row>
      </Container>
    </main>
  );
}