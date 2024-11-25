'use client'

import { ModalFrame } from "@/components/modal_template"
import { useFilePicker } from 'use-file-picker'
import { useContext, useState, useEffect, createContext } from "react"

import {
  Row,
  Col,
  FormGroup,
  Form,
  Input,
  Label,
  Button
} from 'reactstrap';

const Product = createContext(null)

export function SetProduct({ context }) {
  const { modalData: data, setSubmitData } = useContext(context)

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [isAvailable, setIsAvailable] = useState(false);

  const [tags, setTags] = useState([]);
  const [types, setTypes] = useState({});

  const [price, setPrice] = useState();

  const [tagName, setTagName] = useState('');
  const [typeName, setTypeName] = useState('');

  const [category, setCategory] = useState('boys');

  const [productImages, setProductImages] = useState([]);

  const { openFilePicker, filesContent } = useFilePicker({
    accept: ['.png', '.jpg', '.jpeg'],
    multiple: false,
    readAs: 'DataURL'
  });

  function addTag() {
    setTags([...tags, tagName])
    setTagName('')
  }

  function addType() {
    setTypes([{ [typeName]: [{ type: 0 }] }, ...types])
    setTypeName('')
  }

  function removeImage(idx) {
    setProductImages(productImages.filter((a, indx) => indx != idx))
  }

  useEffect(() => {
    setName(data?.name ?? '')
    setDescription(data?.description ?? '')
    setIsAvailable(data?.is_available ?? false)
    setTags(data?.tags ?? [])
    setTypes(data?.type ?? [])
    setPrice(data?.price ?? 0)
    setProductImages(data?.carouselurls ?? [])
    setCategory(data?.category ?? 'boys')
  }, [data]);

  useEffect(() => {
    if (filesContent[0]) {
      setProductImages([...productImages, { content: filesContent[0].content, name: filesContent[0].name.split('.')[0] }])
    }
  }, [filesContent]);

  useEffect(() => {
    setSubmitData({
      carouselurls: productImages,
      description: description,
      is_available: isAvailable,
      name: name,
      price: price,
      tags: tags,
      type: types,
      id: data?.id ?? '',
      category: category.toLowerCase(),
      creation: {
        seconds: data?.creation.seconds ?? 0,
        nanoseconds: data?.creation.nanoseconds ?? 0
      }
    })
  }, [name, description, isAvailable, tags, types, price, productImages, filesContent, category, data]);

  return (
    <ModalFrame context={context} size="lg">
      <div className={'text-muted-mb-3'}><b><p>Add Product</p></b></div>
      <Form>
        <Row className="pb-5">
          <Col md={6}>
            <p className="mb-2">Product Image</p>
            <div className="h-100 w-100">
              <Button className={'fs-1 h-50 py-0 w-100'} outline size="sm" onClick={openFilePicker}>+</Button>
              <div className="w-100 h-50 pt-3 d-flex align-items-center gap-2 overflow-auto">
                {
                  productImages.length > 0 ?
                    productImages.map((data, idx) => <img key={`productimg-$${idx}`} onClick={() => removeImage(idx)} src={data?.content ?? data.url} className="product-image-admin" />)
                    :
                    <div className="h-100 w-100 bg-secondary rounded d-flex justify-content-center align-items-center text-light">
                      Images will be shown here
                    </div>
                }
              </div>
            </div>
          </Col>
          <Col md={6}>
            <Row>
              <Col>
                <FormGroup>
                  <Label>Name</Label>
                  <Input
                    placeholder='Name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>Price</Label>
                  <Input
                    placeholder='price'
                    type='number'
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label>Description</Label>
              <Input
                placeholder='description'
                type='textarea'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label>Category</Label>
              <Input
                placeholder='Genre'
                type='select'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Boys</option>
                <option>Girls</option>
                <option>Unisex</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Input
                placeholder='price'
                type='checkbox'
                checked={isAvailable}
                onChange={() => setIsAvailable(!isAvailable)
                }
              />
              <Label className="ms-2">Is Available</Label>
            </FormGroup>
          </Col>
        </Row>
        <div className="mb-3">
          <Row className="align-items-center">
            <Col md={2}>
              <div className={'text-muted-mb-3 text-nowrap'}><b><p className="m-0">Add Tags</p></b></div>
            </Col>
            <Col md={9}>
              <Input
                placeholder='Tag Name'
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
              />
            </Col>
            <Col md={1}>
              <Button className={'fs-5 py-0'} outline size="sm" color="success" onClick={addTag}>+</Button>
            </Col>
          </Row>
        </div>
        <div className="d-flex mb-4 gap-2">
          {
            tags.length > 0 ?
              tags.map((name, idx) =>
                <Button
                  key={`tagbtn-${idx}`}
                  style={{ borderRadius: 9999 }}
                  outline size="sm"
                  color="primary"
                  onClick={() => {
                    setTags(tags.filter(tag => tag !== name))
                  }}
                >
                  {name} <span className="text-danger">ⓧ</span>
                </Button>
              )
              :
              <p className="my-1">No tags to show</p>
          }
        </div>
        <Product.Provider value={{ setTypes, types }}>
          <div className="mb-3">
            <Row className="align-items-center">
              <Col md={2}>
                <div className={'text-muted-mb-3 text-nowrap'}><b><p className="m-0">Add Types</p></b></div>
              </Col>
              <Col md={9}>
                <Input
                  placeholder='Type name'
                  value={typeName}
                  onChange={(e) => setTypeName(e.target.value)}
                />
              </Col>
              <Col md={1}>
                <Button className={'fs-5 py-0'} outline size="sm" color="success" onClick={addType}>+</Button>
              </Col>
            </Row>
          </div>
          {
            types.length > 0 ?
              types.map((data, idx) => <ProductTypes key={`ptype-${idx}`} name={Object.keys(data)[0]} data={data} typeidx={idx} />)
              :
              <p className="my-1">No types to show</p>
          }
        </Product.Provider>
      </Form>
    </ModalFrame>
  )
}

export function SetUser({ context }) {
  /* const { modalData: data, setSubmitData } = useContext(context) */

  return (
    <ModalFrame context={context} size="lg">

    </ModalFrame>
  )
}

function ProductTypes({ name, typeidx }) {
  const { setTypes, types: typesRaw } = useContext(Product)

  let types = [...typesRaw]
  let type = types[typeidx][name]

  let productTypes = Object.keys(type)

  function addProductType() {
    type.push({ type: 0 })
    setTypes(types)
  }

  function removeProductType() {
    const filteredTypes = types.filter((d, idx) => idx != typeidx)
    setTypes(filteredTypes)
  }

  return (
    <Row className="mb-3">
      <Col className="bg-light pt-2 rounded" md={10}>
        <FormGroup>
          <Row className="mb-3">
            <Col md={1}><Label className="m-0"><b>{name}</b></Label></Col>
            <Col md={1}><Button className={'fs-6 ms-3 py-0'} outline size="sm" color="success" onClick={addProductType}>+</Button></Col>
          </Row>
          <Row className="mb-1 pe-4">
            <Col className="d-flex align-items-center justify-content-end pe-1" md={1}></Col>
            <Col md={7} className="pe-1">
              Type name
            </Col>
            <Col md={3} className="pe-1">
              Type quantity
            </Col>
            <Col md={1}></Col>
          </Row>
          {
            productTypes.map((idx) => <ProductTypeData key={`ptypedata-${idx}`} mainType={name} idx={idx} mainidx={typeidx} />
            )
          }
        </FormGroup>
      </Col>
      <Col md={2}>
        <Button size="sm" outline color="danger" onClick={removeProductType}><b>Remove</b></Button>
      </Col>
    </Row>
  )
}

function ProductTypeData({ idx, mainidx, mainType }) {
  const { setTypes, types: typesRaw } = useContext(Product)

  let types = [...typesRaw]

  const type = types[mainidx][mainType][idx]

  const [typeName, setTypeName] = useState(Object.keys(type)[0])
  const [typeData, setTypeData] = useState(type[typeName])

  function setDataKey(setter, value) {
    delete Object.assign(type, { [value]: type[typeName] })[typeName];

    setter(value)
    setTypes(types)
  }

  function setDataValue(setter, value) {
    type[typeName] = value

    setter(value)
    setTypes(types)
  }

  function removeType() {
    const filteredTypes = types[mainidx][mainType].filter((a, indx) => idx != indx)
    types[mainidx][mainType] = filteredTypes
    setTypes(types)
  }

  useEffect(() => {
    setTypeName(Object.keys(type)[0])
    setTypeData(type[Object.keys(type)[0]])
  }, [typesRaw]);

  return (
    <>
      <Row className="mb-1 pe-4">
        <Col className="d-flex align-items-center justify-content-end pe-1" md={1}>
          {idx}
        </Col>
        <Col md={7} className="pe-1">
          <Input
            placeholder='Type Name'
            value={typeName}
            onChange={e => { setDataKey(setTypeName, e.target.value) }}
          />
        </Col>
        <Col md={3} className="pe-1">
          <Input
            placeholder='Quantity'
            type="number"
            value={typeData}
            onChange={e => { setDataValue(setTypeData, Number(e.target.value)) }}
          />
        </Col>
        <Col md={1}>
          <Button outline color='danger' onClick={removeType}>x</Button>
        </Col>
      </Row>
    </>
  )
}