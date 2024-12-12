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
                DNB Online
              </h6>
              <p>
                A childrens clothing company. Prioritizing affordability without compromising quality.
              </p>
            </Col>
            <Col md="2" lg="2" xl="2" className="mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Products</h6>
              <Link className="text-decoration-none d-block text-white" href="/category/boys" >
                Boys
              </Link>
              <Link className="text-decoration-none d-block text-white" href="/category/girls" >
                Girls
              </Link>
            </Col>
            <Col md="3" lg="2" xl="2" className="mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">
                Useful links
              </h6>
              <Link className="text-decoration-none d-block text-white" href="/profile">
                Settings
              </Link>
              <Link className="text-decoration-none d-block text-white" href="/profile">
                Orders
              </Link>
            </Col>
            <Col md="4" lg="3" xl="3" className="mx-auto mb-md-0 mb-4">
              <h6 className="text-uppercase fw-bold mb-4">The Developers</h6>
              <p className='m-0'>
                <Link className="text-decoration-none d-block text-white" href={'https://www.facebook.com/mavs24/'}>Jon Maverick N. Cruz</Link>
              </p>
              <p className='m-0'>
                <Link className="text-decoration-none d-block text-white" href={'https://www.facebook.com/ormidojm'}>John Mark B. Ormido</Link>
              </p>
              <p className='m-0'>
                <Link className="text-decoration-none d-block text-white" href={'https://www.facebook.com/eddieanne.ricapor'}>Eddieanne C. Ricapor</Link>
              </p>
              <p>
                <Link className="text-decoration-none d-block text-white" href={'https://www.facebook.com/clarkeserrano11'}>King Clarke T. Serrano</Link>
              </p>
              <h6 className="text-uppercase fw-bold">Contact Us</h6>
              <p>
                <Link className="text-decoration-none d-block text-white" href="/about-us" >
                  About Us
                </Link>
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
          DNB.com
        </Link>
      </section>
    </footer>
  );
}
