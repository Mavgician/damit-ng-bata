'use client';

import { convertToPhCurrency } from '@/lib/convertToPHCurrency'

import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button
} from 'reactstrap'

import { fetchParsed } from '@/lib/fetch-parsed'

import Link from 'next/link'
import useSWR from 'swr'

import { useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import Skeleton from 'react-loading-skeleton';


export default function Page() {
  const [productName, setProductName] = useState('');
  const [ghostName, setGhostName] = useState('');

  const [minPrice, setMinPrice] = useState();
  const [maxPrice, setMaxPrice] = useState();
  const [orderby, setOrderby] = useState({ key: 'creation', order: 'desc' });
  const [category, setCategory] = useState('all');

  const [hasNameSearch, setHasNameSearch] = useState(false);

  const [searchParams, setSearchParams] = useState([]);
  const [loader, setLoader] = useState(false);

  const setSearchDebounced = useDebouncedCallback(
    (params) => {
      setSearchParams(params)
    }, 1000
  )

  const { data: product, isLoading, mutate } = useSWR(['api/product/list', orderby, searchParams],
    ([url, order, search]) => fetchParsed(url, {
      method: 'POST',
      body: JSON.stringify({
        orderBy: order.key,
        order: order.order,
        limit: 16,
        search: search
      })
    }))

  function searchHandler() {
    setSearchDebounced.flush()
  }

  function search() {
    let search = []

    if (category != 'all') {
      search.push({
        field: 'category',
        operator: '==',
        searchterm: category
      })
    }

    if (productName.length > 0) {
      search.push({
        field: 'name_insensitive',
        operator: 'array-contains-any',
        searchterm: productName.toLowerCase().split(' ')
      })

      setHasNameSearch(true)
      setGhostName(productName)
    } else {

      setHasNameSearch(false)
    }

    if (minPrice >= 0 && maxPrice > 0) {
      search.push({
        field: 'price',
        operator: '<=',
        searchterm: maxPrice
      })
      search.push({
        field: 'price',
        operator: '>=',
        searchterm: minPrice
      })
    }

    return search
  }

  useEffect(() => {
    if (!isLoading) {
      setLoader(true)
      setSearchDebounced(search())
    }
  }, [productName, minPrice, maxPrice, orderby, category]);

  useEffect(() => {
    if (product) {
      mutate(product, search())
      setLoader(true)
    }
  }, [orderby, category]);

  useEffect(() => {
    setLoader(false)
  }, [product]);

  return (
    <main className='row bg-light'>
      <Col md={3} className='position-relative p-0'>
        <div className='position-sticky w-100 end-0 ps-5 py-4' style={{ top: 56 }}>
          <div className='border border p-4 rounded' style={{background: 'white'}}>
            <h1 className='m-0'><b>Damit ng Bata</b></h1>
            <p className='my-2 fs-3'>Search filters</p>
            <Form onSubmit={e => {
              e.preventDefault()
              searchHandler()
            }}>
              <FormGroup>
                <Label className='mb-2'><b>Product Name</b></Label>
                <Input placeholder='Name' value={productName} onChange={e => setProductName(e.target.value)} />
              </FormGroup>
              <FormGroup>
                <Label className='mb-2'><b>Price Range</b></Label>
                <Row>
                  <Col className='pe-1'>
                    <Label>Min</Label>
                    <Input type='number' min={0} value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value))} placeholder='0' />
                  </Col>
                  <Col className='ps-1'>
                    <Label>Max</Label>
                    <Input type='number' min={0} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} placeholder='1000' />
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <Label className='mb-2'><b>Sort by</b></Label>
                <Input
                  placeholder='Genre'
                  type='select'
                  onChange={(e) => setOrderby(JSON.parse(e.target.value))}
                >
                  <option value={JSON.stringify({ key: 'name', order: 'asc' })}>Title (A-Z)</option>
                  <option value={JSON.stringify({ key: 'name', order: 'desc' })}>Title (Z-A)</option>
                  <option value={JSON.stringify({ key: 'creation', order: 'desc' })}>Newest</option>
                  <option value={JSON.stringify({ key: 'creation', order: 'asc' })}>Oldest</option>
                </Input>
              </FormGroup>
              <FormGroup>
                <p className='mb-2'><b>Category</b></p>
                <div className="d-flex gap-2">
                  <Button className={`rounded-pill ${category === 'boys' ? 'active' : null}`} onClick={e => setCategory(e.target.value)} value='boys' outline color='secondary'>Boys</Button>
                  <Button className={`rounded-pill ${category === 'girls' ? 'active' : null}`} onClick={e => setCategory(e.target.value)} value='girls' outline color='secondary'>Girls</Button>
                  <Button className={`rounded-pill ${category === 'unisex' ? 'active' : null}`} onClick={e => setCategory(e.target.value)} value='unisex' outline color='secondary'>Unisex</Button>
                  <Button className={`rounded-pill ${category === 'all' ? 'active' : null}`} onClick={e => setCategory(e.target.value)} value='all' outline color='secondary'>All</Button>
                </div>
              </FormGroup>
              <div className="d-flex gap-2 justify-content-end">
                <Button color='danger'>Clear</Button>
                <Button color='success' onClick={() => { searchHandler(productName) }}>Search</Button>
              </div>
            </Form>
          </div>
        </div>
      </Col>
      <Col>
        <section className="product-grid">
          <Container>
            <div className='text-secondary d-flex gap-2 mb-2'>
              <Link className='text-reset text-decoration-none' href={'/'}>Homepage</Link>
              &gt;
              <Link className='text-reset text-decoration-none' href={'/shop'}>Shop</Link>
            </div>
            {
              isLoading || loader ?
                <h1 className="mb-4" style={{ fontSize: '2em' }}><Skeleton /></h1>
                :
                product?.data.length > 0 ?
                  <p className='mb-4' style={{ fontSize: '2em' }}>Showing {product.count} result/s {hasNameSearch ? `for "${ghostName}" in category: ${category}` : `for category: ${category}`}</p>
                  :
                  <>
                    <p className='mb-4' style={{ fontSize: '2em' }}>Showing no results {hasNameSearch ? `for "${ghostName}" in category: ${category}` : `for category: ${category}`}</p>
                  </>
            }
            <Row>
              {
                isLoading || loader ?
                  [...Array(8)].map(() =>
                    <Col md={3}>
                      <div className='mb-2'>
                        <Skeleton height={300} />
                      </div>
                      <h5>
                        <Skeleton count={3} />
                      </h5>
                    </Col>
                  )
                  :
                  product.data.length > 0 && product.data.map((product, idx) => (
                    <Col md={3} key={idx} className='p-2'>
                      <div className='rounded border p-3' style={{ background: 'white' }}>
                        <Link
                          className='text-reset text-decoration-none'
                          href={{
                            pathname: `/products/${product.id}`,
                            query: { category: product.category }
                          }}
                        >
                          <div className="product-item">
                            <div className='d-flex align-items-center justify-content-center product-image'>
                              <img src={product.thmburl.url} alt={product.thmburl.id} />
                            </div>
                            <h5 className='text-truncate'>{product.name.join(' ')}</h5>
                            <div className='flex-grow-1 d-flex justify-content-end'>
                              stars
                            </div>
                            <div className="d-flex">
                              <h5>{convertToPhCurrency(product.price)}</h5>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </Col>
                  ))
              }
            </Row>
          </Container>
        </section>
      </Col>
    </main>
  );
}