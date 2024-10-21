'use client'

import {
  Button,
  FormGroup,
  Form,
  Label,
  Input,
  Container,
  Row,
  Col,
  FormFeedback,
  Spinner
} from 'reactstrap'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserCS } from 'firebase-nextjs/client/auth';

export default function Page() {
  const { currentUser } = getUserCS()

  const [username, setUsername] = useState(currentUser.displayName);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [invalid, setInvalid] = useState(false);

  const [isCreated, setIsCreated] = useState(false);

  const router = useRouter()

  async function submitHandler() {
    if (username.length <= 0 || firstName.length <= 0 || lastName.length <= 0) return setInvalid(true)

    setIsCreated(true)

    router.replace('/')

    fetch(
      'api/user/update',
      {
        method: 'POST',
        body: JSON.stringify({
          display_name: username,
          last_name: lastName,
          first_name: firstName
        })
      })
  }

  useEffect(() => {
    fetch('api/user/new', { method: 'POST' })
  }, []);

  return (
    <main className='p-0 position-relative bg-light text-dark'>
      <Container className='vh-100 vw-100 d-flex justify-content-center align-items-center'>
        <Form onKeyDown={event => {
          if (event.key === "Enter") {
            event.preventDefault()
            submitHandler()
          }
        }}>
          <h1 className='mb-4'>Make an account with Damit ng Bata</h1>
          <FormGroup floating>
            <Input
              placeholder='Username'
              type='text'
              value={username}
              invalid={!(username.length > 0) && invalid}
              onChange={e => setUsername(e.target.value)}
            />
            <FormFeedback>
              * Please fill out the required fields
            </FormFeedback>
            <Label>
              Username
            </Label>
          </FormGroup>
          <Row>
            <Col>
              <FormGroup floating>
                <Input
                  placeholder='First name'
                  type='text'
                  value={firstName}
                  invalid={!(firstName.length > 0) && invalid}
                  onChange={e => setFirstName(e.target.value)}
                />
                <FormFeedback>
                  * Please fill out the required fields
                </FormFeedback>
                <Label>
                  First name
                </Label>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup floating>
                <Input
                  placeholder='Last name'
                  type='text'
                  value={lastName}
                  invalid={!(lastName.length > 0) && invalid}
                  onChange={e => setLastName(e.target.value)}
                />
                <FormFeedback>
                  * Please fill out the required fields
                </FormFeedback>
                <Label>
                  Last name
                </Label>
              </FormGroup>
            </Col>
          </Row>
          {
            isCreated ?
              <div className="d-flex justify-content-center align-items-center my-3">
                <h3 style={{ margin: 0 }}>
                  Completing your account
                </h3>
                <Spinner className="ms-3"></Spinner>
              </div>
              :
              <Button className='my-3' block onClick={submitHandler}>
                Complete Account
              </Button>
          }
        </Form>
      </Container>
    </main>
  )
}