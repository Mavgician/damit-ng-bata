'use client'
import { useContext } from "react"

import {
  Modal,
  ModalBody,
  Card,
  CardHeader,
  CardBody,
  Button,
  Spinner
} from 'reactstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCheck,
  faCancel,
} from '@fortawesome/free-solid-svg-icons'

export function ModalFrame({
  size = 'l',
  className = '',
  style = {},
  children = [],
  context
}) {
  let { isOpen, setIsOpen, submit, cancel, isSubmitLoading  } = useContext(context)

  const toggle = () => {
    if (isSubmitLoading) return

    setIsOpen(!isOpen)
    cancel()
  }

  if (!cancel) {
    cancel = () => {}
  }

  if (!submit) {
    submit = () => {toggle()}
  }

  return (
    <Modal toggle={toggle} isOpen={isOpen} unmountOnClose={true} centered={true} size={size}>
      <ModalBody className='p-0'>
        <Card className='bg-light shadow border-0'>
          <CardHeader className={`bg-white py-3 px-4 ${className}`} style={style}>
            {children}
          </CardHeader>
          <CardBody className='d-flex justify-content-end align-items-center'>
            {
              isSubmitLoading && 
              <>
                <p className="m-0 text-success"><b>Saving</b></p>
                <Spinner className="mx-2" size='sm' color="success"></Spinner>
              </>
            }
            <Button outline color='danger' className='mx-1' onClick={toggle}>
              <FontAwesomeIcon icon={faCancel} />
            </Button>
            <Button outline color='success' className='mx-1'
              onClick={() => {
                submit()
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