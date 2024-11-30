'use client'

import { getStripe } from '@/lib/get-stripe'
import { convertToSubCurrency } from '@/lib/convertToSubcurrency'

import { Elements } from '@stripe/react-stripe-js'
import { useSearchParams } from 'next/navigation'

import { CheckoutPage } from '@/components/Checkout'
import { Container } from 'reactstrap'
import { convertToPhCurrency } from '@/src/lib/convertToPHCurrency'

const stripe = getStripe()

export default function Page() {
  const amount = Number(useSearchParams().get('amount'))

  return (
    <main className="vh-100 d-flex justify-content-center align-items-center">
      <Container>
        <h1 className='m-0'>You are about to pay Damit ng Bata <span className="text-primary">{convertToPhCurrency(amount)}</span></h1>
        <Elements
          stripe={stripe}
          options={{
            mode: 'payment',
            amount: convertToSubCurrency(amount),
            currency: 'php'
          }}
        >
          <CheckoutPage amount={amount}/>
        </Elements>
      </Container>
    </main>
  )
}