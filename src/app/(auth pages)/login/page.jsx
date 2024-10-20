"use client";
import { getUserCS } from "firebase-nextjs/client/auth"
import { GoogleSignInButton, EmailSignInButton } from "firebase-nextjs/client/components";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'

import {
    Button,
    FormGroup,
    Label,
    Input,
    Row,
    Col,
    Spinner,
} from 'reactstrap'

import { useState } from "react";

export default function LoginPage() {
    const { currentUser } = getUserCS()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [invalid, setInvalid] = useState(false)

    const social = { height: 50, aspectRatio: 1, borderRadius: '50%' }

    return (
        <main className='p-0 position-relative bg-white'>
            <Row className='p-0 m-0 vh-100'>
                <Col md={6} sm={12} className='d-flex justify-content-center align-items-center'>
                    <div className='w-50'>
                        <center className='text-dark'>
                            {!currentUser ?
                                <>
                                    <h1 className='mb-4'>Sign In</h1>
                                    <GoogleSignInButton>
                                        <Button className='mx-1' style={social} outline={true} color='primary'>
                                            <FontAwesomeIcon icon={faGoogle} />
                                        </Button>
                                    </GoogleSignInButton>
                                    <p className='text-muted mt-3'>or use your account</p>
                                    <FormGroup floating>
                                        <Input
                                            placeholder='Email'
                                            type='email'
                                            value={email}
                                            invalid={invalid ? true : false}
                                            onChange={e => setEmail(e.target.value)}
                                        />
                                        <Label>
                                            Email
                                        </Label>
                                    </FormGroup>
                                    <FormGroup floating>
                                        <Input
                                            placeholder='Password'
                                            type='password'
                                            value={password}
                                            invalid={invalid ? true : false}
                                            onChange={e => setPassword(e.target.value)}
                                        />
                                        <Label>
                                            Password
                                        </Label>
                                    </FormGroup>
                                    <div className='my-3'>
                                        <EmailSignInButton email={email} password={password} setErrorMessage={setInvalid}>
                                            <Button block onClick={EmailSignInButton}>
                                                Sign In
                                            </Button>
                                        </EmailSignInButton>
                                    </div>
                                    <p className="text-danger"><b>{invalid}</b></p>
                                </>
                                :
                                <div className="d-flex justify-content-center align-items-center">
                                    <h3 style={{ margin: 0 }}>
                                        Signing you in
                                    </h3>
                                    <Spinner className="ms-3"></Spinner>
                                </div>
                            }
                        </center>
                    </div>
                </Col>
                <Col md={6} sm={12} className='bg-black d-flex justify-content-center align-items-center text-white'>
                    <div>
                        <center className='my-4'>
                            {/* <img src={logo.src} className='my-2 w-50' /> */}
                        </center>
                        <h1>Damit ng Bata</h1>
                        <p>Childrens wear.</p>
                        <Button block onClick={() => { }}>
                            Sign Up
                        </Button>
                    </div>
                </Col>
            </Row>
        </main>
    )
}
