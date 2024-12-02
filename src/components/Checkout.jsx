'use client'

import { useState, useEffect, createContext, useContext } from "react"
import { convertToSubCurrency } from "@/lib/convertToSubcurrency"

import {
  useStripe,
  useElements,
  PaymentElement,
  AddressElement,
} from '@stripe/react-stripe-js'

import { Button, Form, Row, Col, Spinner } from "reactstrap"
import { convertToPhCurrency } from "@/lib/convertToPHCurrency"

import { ConfirmationModal } from './modal_template'

import Skeleton from "react-loading-skeleton"
import { useRouter, useSearchParams } from "next/navigation"

const PayContext = createContext(null)

export function CheckoutPage({ amount, context, isLoading: isItemLoading }) {
  const stripe = useStripe()
  const elements = useElements()

  const [clientSecret, setClientSecret] = useState('')
  const [savedLocations, setSavedLocations] = useState([]);

  const [loading, setLoading] = useState(false)

  const [isExit, setIsExit] = useState(false);

  const { orders } = useContext(context)

  const router = useRouter()

  const query = useSearchParams()

  async function submitHandler(e) {
    e.preventDefault()
    setLoading(true)

    if (!stripe || !elements) return

    const { selectedPaymentMethod: payment_mode, error: submitError } = await elements.submit()

    const { isNewAddress, value: address } = await elements.getElement('address').getValue()

    if (submitError) {
      console.warn(submitError.message)
      setLoading(false)
      return
    }

    if (isNewAddress) {
      fetch(
        'api/user/add-address',
        {
          method: 'POST',
          body: JSON.stringify({ ...address })
        }
      )
    }

    for (let i = 0; i < orders.length; i++) {
      fetch(
        `api/order/pay`,
        {
          method: 'POST',
          body: JSON.stringify({
            id: orders[i].id,
            amount: orders[i].amount,
            payment_mode: payment_mode
          })
        }
      )
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/checkout-success?amount=${amount}`
      }
    })

    if (error) {
      console.warn(error.message)
    }

    setLoading(false)
  }

  async function cancelHandler() {
    if (query.get('is_buying')) {
      fetch('api/order/update-status', {
        method: 'POST',
        body: JSON.stringify({
          id: query.get('order_id'),
          status: 'cancelled'
        })
      })
    }

    router.back()
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

    fetch('api/user/get-address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => setSavedLocations(data))
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
      <PayContext.Provider value={{ isOpen: isExit, setIsOpen: setIsExit, submit: cancelHandler }}>
        <ConfirmationModal context={PayContext}>
          You are about to cancel your payment.
        </ConfirmationModal>
      </PayContext.Provider>
      <Form onSubmit={submitHandler}>
        <div className="mb-4">
          <h5 className='m-0 fw-normal'>1. Fill out payment information</h5>
          <div>{clientSecret && <PaymentElement />}</div>
          <hr />
          <h5 className='m-0 my-4 fw-normal'>2. Select an address</h5>
          <div>
            {clientSecret &&
              <AddressElement
                onSubmit={(e) => { console.log(e) }}
                options={{
                  mode: 'shipping',
                  fields: { phone: 'always' },
                  validation: {
                    phone: { required: 'always' }
                  },
                  contacts: savedLocations
                }}
              />
            }
          </div>
        </div>
        <Row>
          <Col className="pe-1" md={2}>
            <Button onClick={() => setIsExit(true)} className="w-100 py-3" size="lg" color="danger">
              Cancel
            </Button>
          </Col>
          <Col className="ps-1" md={10}>
            <Button type="submit" disabled={!stripe || loading || isItemLoading} className="w-100 py-3" size="lg" color="dark">
              {!loading ? <b>Pay {convertToPhCurrency(amount)}</b> : <Spinner size={'sm'} />}
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  )
}