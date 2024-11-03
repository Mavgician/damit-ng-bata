'use client'
import { useState } from "react"

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
  submit = () => { isOpen = false },
  isOpen,
  toggle = (e) => { },
  size = 'l',
  className = '',
  style = {},
  children = [],
  link = undefined,
  replace = false
}) {
  const [open, setOpen] = useState(isOpen)

  const tog = () => {
    setOpen(!open)
    toggle(prev => { })
  }

  return (
    <Modal toggle={tog} isOpen={isOpen} unmountOnClose={true} centered={true} size={size}>
      <ModalBody className='p-0'>
        <Card className='bg-light shadow border-0'>
          <CardHeader className={`bg-white py-3 px-4 ${className}`} style={style}>
            {children}
          </CardHeader>
          <CardBody className='d-flex justify-content-end'>
            <Button outline color='danger' className='mx-1' onClick={() => { tog() }}>
              <FontAwesomeIcon icon={faCancel} />
            </Button>
            {link ?

              <Link href={link} replace={replace} className='mx-1 d-block btn btn-outline btn-success'>
                <FontAwesomeIcon icon={faCheck} />
              </Link>
              :
              <Button outline color='success' className='mx-1'
                onClick={() => {
                  submit()
                  setOpen(false)
                }}>
                <FontAwesomeIcon icon={faCheck} />
              </Button>

            }
          </CardBody>
        </Card>
      </ModalBody>
    </Modal>
  )
}

export function ConfirmationModal({ submit, isOpen, toggle, children }) {
  return (
    <ModalFrame toggle={toggle} isOpen={isOpen} submit={submit}>
      <div className='text-danger mb-3 d-block fw-bold'>
        <big>Are you sure?</big>
      </div>
      <p>{children}</p>
    </ModalFrame>
  );
}