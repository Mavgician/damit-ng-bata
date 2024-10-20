'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  faEnvelope,
  faHome,
  faPhone,
  faPrint
} from '@fortawesome/free-solid-svg-icons';

import {
  Container,
  Row,
  Col
} from 'reactstrap'

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="text-center text-lg-start text-muted bg-dark position-relative">
      <section>
        <Container className="text-center text-md-start py-5 text-white">
          <Row className="mt-3">
            <Col md="3" lg="4" xl="3" className="mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">
                {/* <MDBIcon icon="gem" className="me-3" /> */}
                ConFlix Online
              </h6>
              <p>
                A ticket reseller established during the pandemic. We strive to deliver a service that brings tickets to everyone.
              </p>
            </Col>
            <Col md="2" lg="2" xl="2" className="mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Products</h6>
              <Link href="#!" className="text-decoration-none d-block text-white">
                About Us
              </Link>
              <Link href="#!" className="text-decoration-none d-block text-white">
                Events
              </Link>
              <Link href="#!" className="text-decoration-none d-block text-white">
                Tickets
              </Link>
            </Col>
            <Col md="3" lg="2" xl="2" className="mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">
                Useful links
              </h6>
              <Link href="#!" className="text-decoration-none d-block text-white">
                Pricing
              </Link>
              <Link href="#!" className="text-decoration-none d-block text-white">
                Settings
              </Link>
              <Link href="#!" className="text-decoration-none d-block text-white">
                Orders
              </Link>
              <Link href="#!" className="text-decoration-none d-block text-white">
                Help
              </Link>
            </Col>
            <Col md="4" lg="3" xl="3" className="mx-auto mb-md-0 mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Contact</h6>
              <p>
                <FontAwesomeIcon icon={faHome} className='me-2' /> New York, NY 10012, US
              </p>
              <p>
                <FontAwesomeIcon icon={faEnvelope} className='me-2' /> info@example.com
              </p>
              <p>
                <FontAwesomeIcon icon={faPhone} className='me-2' /> + 01 234 567 88
              </p>
              <p>
                <FontAwesomeIcon icon={faPrint} className='me-2' /> + 01 234 567 89
              </p>
            </Col>
          </Row>
        </Container>
      </section>
      <section
        className="text-center p-4 text-white"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
      >
        © 2024 Copyright&nbsp;
        <Link className="text-decoration-none fw-bold text-white" href="#">
          ConFlix.com
        </Link>
      </section>
    </footer>
  );
}
