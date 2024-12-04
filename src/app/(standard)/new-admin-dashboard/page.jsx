'use client'

import { Button, Col, Container, Row } from "reactstrap"
import { useState } from "react"
import useSWR from "swr"
import { fetchParsed } from "@/src/lib/fetch-parsed"

function Section({ onClick, route, currentActiveID, nameKey }) {
  const { data: list, isLoading } = useSWR([route], ([url]) =>
    fetchParsed(
      url,
      {
        method: 'POST',
        body: JSON.stringify({
          orderBy: 'creation',
          order: 'desc',
          limit: 1000,
        })
      }
    )
  )

  function btnHandler(id) {
    onClick(id)
  }

  if (isLoading) return

  const buttons = list.data.map((data, idx) => (
    <Button key={`section-btn-${data.id ?? idx}`} active={currentActiveID == data.id} onClick={() => { btnHandler(data.id) }} className="rounded-0 w-100 text-start d-flex" color="light">
      {data[nameKey] ?? data?.data[nameKey]} <span className={`ms-auto fw-bold ${currentActiveID != data.id && 'd-none'}`}>&gt;</span>
    </Button>
  ))

  return buttons
}

export default function Page() {
  const [activeDocumentID, setActiveDocumentID] = useState(null);
  const [activeCollection, setActiveCollection] = useState(null);

  return (
    <main className="p-5 bg-light">
      <Container>
        <h1>Admin Dashboard</h1>
        <p className="fs-3 mb-1">Document Store</p>
        <div className="border rounded py-3 px-5 mb-5" style={{ background: 'white' }}>
          <Row>
            <Col md={3} className="border p-2">Collection</Col>
            <Col md={3} className="border p-2">List</Col>
            <Col md={6} className="border p-2">Document</Col>
            <Col md={3} className="border p-0">
              <Section onClick={setActiveCollection} currentActiveID={activeCollection} route={'api/admin/get-collections'} nameKey={'name'}/>
            </Col>
            <Col md={3} className="border p-0">
              <Section onClick={setActiveDocumentID} currentActiveID={activeDocumentID} route={'api/user/list'} nameKey={'id'}/>
            </Col>
            <Col md={6} className="border p-0">

            </Col>
          </Row>
        </div>
        <p className="fs-3 mb-1">Landing Page</p>
      </Container>
    </main>
  )
}