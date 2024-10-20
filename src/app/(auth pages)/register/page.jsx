'use client'

export default function Page() {
  return (
    <main>
      <h1>in register</h1>
    </main>
  );
}

/* import Image from 'next/image';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'

import { faLongArrowLeft } from '@fortawesome/free-solid-svg-icons'

import { useSignInWithGoogle, useSignInWithFacebook, useSignOut, useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth'
import {
  Button,
  FormGroup,
  Form,
  Label,
  Input,
  Row,
  Col,
  Container,
  FormFeedback
} from 'reactstrap'

import { auth, db } from '@/scripts/firebase'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'

export default function Page() {
  const [
    createUserWithEmailAndPassword,
    user,
    loading,
    error,
  ] = useCreateUserWithEmailAndPassword(auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsCond, setTermsCond] = useState(false);

  const [errorMsg_p, setErrorMsg_p] = useState('');
  const [errorMsg_e, setErrorMsg_e] = useState('');

  const router = useRouter()

  async function submitHandler() {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/

    let e_e_message = ''
    let e_p_message = ''

    if (password !== confirmPassword) e_p_message = '* Passwords do not match.'
    if (password.length < 8) e_p_message = `* Please use at least 8 characters (you are currently using ${password.length} characters).`
    if (password.length === 0) e_p_message = '* Please provide a password.'

    if (!emailRegex.test(email)) e_e_message = '* Invalid email.'
    if (email.length === 0) e_e_message = '* Please provide an email.'

    setErrorMsg_e(e_e_message)
    setErrorMsg_p(e_p_message)

    if (e_e_message.length || e_p_message.length || !termsCond) return null
    else return await createUserWithEmailAndPassword(email, password)
  }

  useEffect(() => {
    (
      async () => {
        if (user) {
          await setDoc(doc(db, 'user', user.user.uid), {
            d_name: user.user.displayName,
            email: user.user.email,
            account_type: 'user',
            account_image: user.user.photoURL,
            orders: [],
            created_at: serverTimestamp()
          })
          router.replace(`/account-setup/${user.user.uid}`)
        }
      }
    )()
  }, [loading]);

  return (
    <main className='p-0 position-relative bg-light text-dark'>
      <Container className='vh-100 vw-100 d-flex justify-content-center align-items-center'>
        <div>
          <Form onKeyDown={event => { if (event.key === "Enter") submitHandler() }}>
            <h1 className='mb-4'>Make an account with ConFlix</h1>
            <FormGroup floating>
              <Input
                placeholder='Email'
                type='email'
                value={email}
                invalid={errorMsg_e.length > 0}
                onChange={e => setEmail(e.target.value)}
              />
              <Label>
                Email
              </Label>
              <FormFeedback>{errorMsg_e}</FormFeedback>
            </FormGroup>
            <FormGroup floating>
              <Input
                placeholder='Password'
                type='password'
                value={password}
                invalid={errorMsg_p.length > 0}
                onChange={e => setPassword(e.target.value)}
              />
              <Label>
                Password
              </Label>
              <FormFeedback>{errorMsg_p}</FormFeedback>
            </FormGroup>
            <FormGroup floating>
              <Input
                placeholder='Password'
                type='password'
                value={confirmPassword}
                invalid={errorMsg_p.length > 0}
                onChange={e => setConfirmPassword(e.target.value)}
              />
              <Label>
                Confirm Password
              </Label>
            </FormGroup>
            <FormGroup>
              <Label>
                <Input
                  type='checkbox'
                  invalid={!termsCond}
                  onChange={() => setTermsCond(!termsCond)}
                />
                &nbsp;&nbsp;&nbsp;&nbsp;
                I agree with the terms and conditions
                <FormFeedback>* Please agree to our terms and conditions before registering.</FormFeedback>
              </Label>
            </FormGroup>
            <div className='my-3'>
              <Button block onClick={submitHandler}>
                Sign Up
              </Button>
            </div>
          </Form>
        </div>
      </Container>
    </main>
  )
} */