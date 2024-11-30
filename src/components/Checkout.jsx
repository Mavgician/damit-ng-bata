'use client'

import { useState, useEffect, createContext } from "react"
import { convertToSubCurrency } from "@/lib/convertToSubcurrency"

import {
  useStripe,
  useElements,
  PaymentElement
} from '@stripe/react-stripe-js'

import { Button, Form, Row, Col, Spinner } from "reactstrap"
import { convertToPhCurrency } from "@/lib/convertToPHCurrency"

import { ConfirmationModal } from './modal_template'

import Skeleton from "react-loading-skeleton"
import { useRouter } from "next/navigation"

const PayContext = createContext(null)

export function CheckoutPage({ amount }) {
  const stripe = useStripe()
  const elements = useElements()

  const [clientSecret, setClientSecret] = useState('')
  const [loading, setLoading] = useState(false)

  const [isExit, setIsExit] = useState(false);

  const router = useRouter()

  async function submitHandler(e) {
    e.preventDefault()
    setLoading(true)

    if (!stripe || !elements) return

    const { error: submitError } = await elements.submit()

    if (submitError) {
      console.warn(submitError.message)
      setLoading(false)
      return
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/checkout-success`
      }
    })

    if (error) {
      console.warn(error.message)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetch('api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount: convertToSubCurrency(amount) })
    })
      .then(res => res.json())
      .then(data => setClientSecret(data.clientSecret))
  }, [amount]);

  if (!clientSecret || !stripe || !elements) {
    return (
      <div>
        <Skeleton height={20} className="mb-2" />
        <Row className="mb-2">
          <Col md={6}>
            <div>
              <Skeleton height={50} />
            </div>
          </Col>
          <Col md={3}>
            <div>
              <Skeleton height={50} />
            </div>
          </Col>
          <Col md={3}>
            <div>
              <Skeleton height={50} />
            </div>
          </Col>
        </Row>
        <Skeleton className="mb-2" height={50} />
        <Row>
          <Col md={2} className="pe-1">
            <Skeleton height={80} />
          </Col>
          <Col md={10} className="ps-1">
            <Skeleton height={80} />
          </Col>
        </Row>
      </div>
    )
  }

  return (
    <>
      <PayContext.Provider value={{ isOpen: isExit, setIsOpen: setIsExit, cancel: () => { }, submit: () => router.back()}}>
        <ConfirmationModal context={PayContext}>
          You are about to cancel your payment.
        </ConfirmationModal>
      </PayContext.Provider>
      <Form onSubmit={submitHandler}>
        {clientSecret && <PaymentElement onChange={e => console.log(e)}/>}
        <Row>
          <Col className="pe-1" md={2}>
            <Button onClick={() => setIsExit(true)} className="my-4 w-100 py-3" size="lg" color="danger">
              Cancel
            </Button>
          </Col>
          <Col className="ps-1" md={10}>
            <Button onClick={submitHandler} disabled={!stripe || loading} className="my-4 w-100 py-3" size="lg" color="dark">
              {!loading ? <b>Pay {convertToPhCurrency(amount)}</b> : <Spinner size={'sm'}/>}
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  )
}