'use client'

import {
  Container
} from 'reactstrap'

import Link from 'next/link'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Page() {
  const [redirectSeconds, setRedirectSeconds] = useState(5)
  const router = useRouter()

  useEffect(() => {
    
  }, []);

  useEffect(() => {
    if (redirectSeconds == 0) {
      router.replace(window.location.origin)
      return
    }

    setTimeout(() => {
      setRedirectSeconds((redirectSeconds) => redirectSeconds - 1)
    }, 1000)
  }, [redirectSeconds]);

  return (
    <main className="vh-100 d-flex justify-content-center align-items-center">
      <Container className='text-center'>
        <p className='text-center fs-4'>Thank you for trusting <b>Damit ng Bata</b></p>
        <div className='my-3 py-3 px-5 bg-primary text-light rounded'>
          <h1>You have payed [amount]</h1>
        </div>
        <p className='fs-5'>Please expect your order to arrive within 5 business days. You may email us at damit-ng-bata@email.com for any inquiries about your order/s.</p>
        <p className='text-secondary'>You will be redirected back after {redirectSeconds} second/s. If not you can click <Link href={window.location.origin}>here</Link>.</p>
      </Container>
    </main>
  )
}