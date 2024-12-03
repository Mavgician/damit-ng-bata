'use client'

import { useContext, useState } from "react"
import {
  Table,
  Button,
  Spinner
} from "reactstrap"

export function Address({ context }) {
  const { user, setTab, mutate } = useContext(context)

  const [isLoading, setIsLoading] = useState(false);

  async function removebtn(index) {
    setIsLoading(true)

    await fetch('/api/user/remove-address', {
      method: 'POST',
      body: JSON.stringify({
        index: index
      })
    })

    await mutate()
    setIsLoading(false)
  }

  return (
    <>
      <div className="mb-2 d-flex align-items-center gap-3">
        <p className='fs-3 m-0'>Address Book</p>
        {isLoading && <Spinner />}
      </div>
      <div className="border rounded">
        {
          user.locations.length > 0 ?
            <>
              <Table hover responsive className='m-0'>
                <thead>
                  <tr>
                    <th className='col-2 text-secondary fw-normal'>Full Name</th>
                    <th className='col-2 text-secondary fw-normal'>Address</th>
                    <th className='col-2 text-secondary fw-normal'>Postcode</th>
                    <th className='col-2 text-secondary fw-normal'>Phone Number</th>
                    <th className='col-2 text-secondary fw-normal'></th>
                    <th className='col-2 text-secondary fw-normal'></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    user.locations.map((data, idx) =>
                      <tr key={`user-table-detail-${idx}`}>
                        <td className='text-muted' style={{ fontSize: '0.9em' }}>
                          <span>{data.name}</span>
                        </td>
                        <td className='text-muted' style={{ fontSize: '0.9em' }}>
                          <span>{`${data.address.line1}, ${data.address.line2}`}</span>
                        </td>
                        <td className='text-muted' style={{ fontSize: '0.9em' }}>
                          <span>{`${data.address.postal_code}, ${data.address.city}`}</span>
                        </td>
                        <td className='text-muted' style={{ fontSize: '0.9em' }}>
                          <span>{data.phone}</span>
                        </td>
                        <td className='text-muted' style={{ fontSize: '0.9em' }}>
                          <span><i>{data.active && 'Default Shipping Address'}</i></span>
                        </td>
                        <td className='text-muted' style={{ fontSize: '0.9em' }}>
                          <div className="d-flex">
                            {
                              !data.active && (
                                <Button outline disabled={isLoading} color='danger' size='sm' className='mx-1' onClick={() => { removebtn(idx) }}>
                                  Delete
                                </Button>
                              )
                            }
                          </div>
                        </td>
                      </tr>
                    )
                  }
                </tbody>
              </Table>
              <Button color="light" className="w-100" size="lg" onClick={() => setTab(10)}>+ Add a new address</Button>
            </>
            :
            <div className="text-secondary">
              <h3>There are no addresses saved.</h3>
              <p>Please add an address above</p>
            </div>
        }
      </div>
    </>
  )
}