import Link from "next/link"

import { Col } from "reactstrap"
import { convertToPhCurrency } from "@/lib/convertToPHCurrency"

export function ProductCard({ data: product, category }) {

  return (
    <Col md={3} className='p-2'>
      <div className='rounded border p-3' style={{ background: 'white' }}>
        <Link
          className='text-reset text-decoration-none'
          href={{
            pathname: `/products/${product.id}`,
            query: { category: category }
          }}
        >
          <div className="product-item">
            <div className='d-flex align-items-center justify-content-center product-image'>
              <img src={product.thmburl.url} alt={product.thmburl.id} />
            </div>
            <h5 className='text-truncate'>{product.name.join(' ')}</h5>
            <div className='flex-grow-1 d-flex justify-content-end'>
            </div>
            <div className="d-flex">
              <h5>{convertToPhCurrency(product.price)}</h5>
            </div>
          </div>
        </Link>
      </div>
    </Col>
  )
}