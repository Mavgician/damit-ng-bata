'use client'
import { useContext } from "react"

import {
  Modal,
  ModalBody,
  Card,
  CardHeader,
  CardBody,
  Button,
} from 'reactstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCheck,
  faCancel,
} from '@fortawesome/free-solid-svg-icons'

import Link from "next/link"

export function ModalFrame({
  size = 'l',
  className = '',
  style = {},
  children = [],
  context
}) {
  const { isOpen, setIsOpen, submit } = useContext(context)

  const toggle = () => setIsOpen(!isOpen)

  return (
    <Modal toggle={toggle} isOpen={isOpen} unmountOnClose={true} centered={true} size={size}>
      <ModalBody className='p-0'>
        <Card className='bg-light shadow border-0'>
          <CardHeader className={`bg-white py-3 px-4 ${className}`} style={style}>
            {children}
          </CardHeader>
          <CardBody className='d-flex justify-content-end'>
            <Button outline color='danger' className='mx-1' onClick={() => { setIsOpen(false) }}>
              <FontAwesomeIcon icon={faCancel} />
            </Button>
            <Button outline color='success' className='mx-1'
              onClick={() => {
                submit()
                setIsOpen(false)
              }}>
              <FontAwesomeIcon icon={faCheck} />
            </Button>
          </CardBody>
        </Card>
      </ModalBody>
    </Modal>
  )
}

export function ConfirmationModal({ children, context }) {
  return (
    <ModalFrame context={context}>
      <div className='text-danger mb-3 d-block fw-bold'>
        <big>Are you sure?</big>
      </div>
      <p>{children}</p>
    </ModalFrame>
  );
}