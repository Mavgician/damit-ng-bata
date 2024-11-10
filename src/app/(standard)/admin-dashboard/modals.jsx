'use client'

import { ModalFrame } from "@/components/modal_template"
import { fetchParsed } from "@/src/lib/DataServer"
import { useContext } from "react"
import useSWR from "swr"

import {
  Row,
  Col,
  FormGroup,
  Form,
  Input,
  Label
} from 'reactstrap';

export function SetProduct({ context }) {
  const { modalData: productID } = useContext(context)

  const { data, isLoading } = useSWR(
    ['api/product/item'], ([url]) =>
    fetchParsed(url,
      {
        method: 'POST',
        body: JSON.stringify({ productID: productID })
      }
    )
  )

  return (
    <ModalFrame context={context} size="xl">
      <div className={'text-muted-mb-3'}><b><p>Add Product</p></b></div>
      {
        isLoading ?
          <h1>Fetching data</h1> :
          <Form>
            <Row>
              <Col>
                <FormGroup>
                  <Label>Product Name</Label>
                  <Input
                    placeholder='Name'
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>Price</Label>
                  <Input
                    placeholder='price'
                    type='number'
                  />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label>Description</Label>
              <Input
                placeholder='price'
                type='textarea'
              />
            </FormGroup>
            <FormGroup>
              <Input
                placeholder='price'
                type='checkbox'
              />
              <Label className="ms-2">Is Available</Label>
            </FormGroup>
          </Form>
      }
    </ModalFrame>
  )
}

export function SetUser({ isOpen, toggle, data, id }) {

}