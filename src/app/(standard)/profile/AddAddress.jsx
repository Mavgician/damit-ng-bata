'use client'

import { getStripe } from '@/lib/get-stripe'
import { Elements } from '@stripe/react-stripe-js'

import { StripeAddress } from '@/components/StripeAddress'

const stripe = getStripe()

export function AddAddress({ context }) {
  return (
    <>
      <div className="mb-2 d-flex align-items-center gap-3">
        <p className='fs-3 m-0'>Add new address</p>
      </div>
      {
        stripe && (
          <Elements stripe={stripe}>
            <StripeAddress context={context} />
          </Elements>
        )
      }
    </>
  )
}