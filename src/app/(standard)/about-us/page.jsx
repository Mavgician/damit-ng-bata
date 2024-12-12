'use client'

import { Container, Row, Col, Card, CardSubtitle, CardTitle, Button } from "reactstrap";
import Link from "next/link";

export default function Page() {

  return (
    <main className="bg-light py-5">
      <Container style={{ background: 'white' }} className="border rounded p-5 mb-4">
        <h3>Meet the Developers</h3>
        <Row>
          <Col md={3}>
            <Card>
              <img src="https://res.cloudinary.com/damit-ng-bata/image/upload/v1733999995/authors/Maverick.png" alt="" className="mb-3" />
              <CardTitle tag={'h5'} className="text-center">
                Jon Maverick N. Cruz
              </CardTitle>
              <CardSubtitle tag={'h6'} className="mb-3 text-center text-muted">
                The Creator
              </CardSubtitle>
              <Link href={'https://www.facebook.com/mavs24/'} className="d-flex text-decoration-none">
                <Button className="rounded-0 w-100" color='light'>
                  Go to social
                </Button>
              </Link>
            </Card>
          </Col>
          <Col md={3}>
            <Card>
              <img src="https://res.cloudinary.com/damit-ng-bata/image/upload/v1734000438/authors/JM_Ormido.jpg" alt="" className="mb-3" />
              <CardTitle tag={'h5'} className="text-center">
                John Mark B. Ormido
              </CardTitle>
              <CardSubtitle tag={'h6'} className="mb-3 text-center text-muted">
                The Founder
              </CardSubtitle>
              <Link href={'https://www.facebook.com/ormidojm'} className="d-flex text-decoration-none">
                <Button className="rounded-0 w-100" color='light'>
                  Go to social
                </Button>
              </Link>
            </Card>
          </Col>
          <Col md={3}>
            <Card>
              <img src="https://res.cloudinary.com/damit-ng-bata/image/upload/v1734000118/authors/Edd.jpg" alt="" className="mb-3" />
              <CardTitle tag={'h5'} className="text-center">
                Eddieanne C. Ricapor
              </CardTitle>
              <CardSubtitle tag={'h6'} className="mb-3 text-center text-muted">
                The Archivist
              </CardSubtitle>
              <Link href={'https://www.facebook.com/eddieanne.ricapor'} className="d-flex text-decoration-none">
                <Button className="rounded-0 w-100" color='light'>
                  Go to social
                </Button>
              </Link>
            </Card>
          </Col>
          <Col md={3}>
            <Card>
              <img src="https://res.cloudinary.com/damit-ng-bata/image/upload/v1734000351/authors/Clarke.png" alt="" className="mb-3" />
              <CardTitle tag={'h5'} className="text-center">
                King Clarke T. Serrano
              </CardTitle>
              <CardSubtitle tag={'h6'} className="mb-3 text-center text-muted">
                The Artisan
              </CardSubtitle>
              <Link href={'https://www.facebook.com/clarkeserrano11'} className="d-flex text-decoration-none">
                <Button className="rounded-0 w-100" color='light'>
                  Go to social
                </Button>
              </Link>
            </Card>
          </Col>
        </Row>
      </Container>
      <Container style={{ background: 'white' }} className="border rounded p-5 mb-4">
        <h3>Our Mission</h3>
        <p>
          &quot;<i>At <b>DNB</b>,</i> our mission is to <b>enhance the life and overall enjoyment</b> of parents by providing <i>exceptional apparel services</i> in a customer-focused environment. We are dedicated to offering a wide range of children&apos;s apparel for various uses and situations, ensuring that everyone can find the perfect experience.
        </p>
        <p>
          Our team of skilled professionals is committed to providing seamless clothing solutions that prioritize convenience, reliability, and customer satisfaction. Through continuous innovation and a commitment to excellence, we aim to enhance the lives of parents and children.
        </p>
        <p>
          Our commitment extends beyond sales; we aim to <b>engage with our customers</b> and <b>enhance their overall experience</b> through personalized recommendations and customer support.
        </p>
      </Container>
      <Container style={{ background: 'white' }} className="border rounded p-5 mb-4">
        <h3>About Us</h3>
        <p className="text-justify">
          <b>DNB</b> was established on the tenets of simplicity, modernity, and an unwavering dedication to quality. Our primary goal is to provide parents with affordable clothing for their children without compromising quality. We firmly believe in the harmonious blend of quality, efficiency, and simplicity, woven into the very foundation of our company.
        </p>
        <p>
          With an emphasis on customer satisfaction and secure transactions, we offer a comprehensive range of childrens attire. At Damit ng Bata, our ethos revolves around a steadfast dedication to modernity. We invest in the latest technology and ensure our platforms stay updated with industry advancients. This dedication ensures effective, precise, and state-of-the-art clothe selling services, guaranteeing optimal experiences for our customers. Quality is the cornerstone of DNB; we understand that every transaction, no matter how simple, deserves the utmost care.
        </p>
        <p>
          Our team of knowledgeable and experienced professionals upholds the highest standards of service at DNB. We take immense pride in our meticulous processes, fostering trust and satisfaction in a secure and efficient environment.
        </p>
        <p>
          In addition to our commitment to excellence in clothe selling, we value community engagement and regularly participate in events aimed at promoting affordability for parents. We believe in contributing to the cultural vibrancy of our community and supporting initiatives that enhance the overall experience of parents. DNB is not just a children&apos;  s apparel selling platform; it&apos;s a part of the rich history of parenting.
        </p>
      </Container>
    </main>
  );
}
