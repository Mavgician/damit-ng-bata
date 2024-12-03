'use client'

import { useContext, useEffect, useState } from "react"

import {
  useElements,
  AddressElement,
} from '@stripe/react-stripe-js'

import { Button, Spinner } from "reactstrap"

export function StripeAddress({ context }) {
  const { user, setTab, mutate } = useContext(context)

  const [isLoading, setIsLoading] = useState(false);

  const elements = useElements()

  async function submitHandler(e) {
    e.preventDefault()

    if (!elements) return

    const { value: address, complete } = await elements.getElement('address').getValue()

    if (!complete) return

    setIsLoading(true)

    await fetch('/api/user/add-address', {
      method: 'POST',
      body: JSON.stringify(address)
    })

    mutate()

    setIsLoading(false)
    setTab(2)
    elements.getElement('address').clear()
  }

  function cancelHandler() {
    setTab(2)
    elements.getElement('address').clear()
  }

  if (!elements) {
    return (
      <div>

      </div>
    )
  }

  return (
    <>
      <AddressElement
        onSubmit={(e) => { console.log(e) }}
        options={{
          mode: 'shipping',
          fields: { phone: 'always' },
          validation: {
            phone: { required: 'always' }
          },
          defaultValues: {
            name: `${user.name.first} ${user.name.last}`,
            address: {
              country: 'PH'
            }
          }
        }}
      />
      <div className="d-flex gap-2 justify-content-end align-items-center mt-4">
        {isLoading && <Spinner className="me-3" />}
        <Button onClick={cancelHandler} disabled={isLoading} color="secondary">
          Cancel
        </Button>
        <Button onClick={submitHandler} disabled={isLoading} color="success">
          Save address
        </Button>
        <Button onClick={() => {elements.getElement('address').update({defaultValues: {
            name: `${user.name.first} ${user.name.last}`,
            address: {
              country: 'PH'
            }
          }})}} disabled={isLoading} color="success">
          test
        </Button>
      </div>
    </>
  )
}