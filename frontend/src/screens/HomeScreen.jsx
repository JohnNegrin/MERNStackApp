import { useRef, useState, useEffect } from "react";
import { Dropdown, Button, Form, Row, Col } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";

import { useGetProductsQuery } from "../slices/productsApiSlice";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
import Meta from "../components/Meta";

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();
  let minimumRef = useRef();
  let maximumRef = useRef();

  // https://robinwieruch.de/react-form/

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  const [products, setProducts] = useState(data?.products || []);

  useEffect(() => {
    if (data?.products) {
      setProducts(data.products);
    }
  }, [data]);

  const inRange = (product) => {
    const price = product.price;
    if (minimumRef.current.value === "" || maximumRef.current.value === "") {
      return true;
    } else if (
      price > minimumRef.current.value &&
      price < maximumRef.current.value
    ) {
      return true;
    }
  };

  const priceFilter = (e) => {
    e.preventDefault();

    const filteredProducts = data.products.filter(inRange);
    setProducts(filteredProducts);
  };

  console.log(data);

  return (
    <>
      {/* {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to="/" className="btn btn-light mb-4">
          Go Back
        </Link>
      )} */}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Meta />
          <h1>Latest Products</h1>
          {/*  BEGINNING OF ADDED CODE */}
          <div className="d-flex">
            {/* Form for submitting price range */}
            <Form className="d-flex" onSubmit={priceFilter}>
              <Button type="submit" className="me-1">
                Filter
              </Button>

              <div className="d-flex">
                <input
                  type="text"
                  placeholder="Min Price"
                  name="mininmum"
                  className="me-1 form-control"
                  ref={minimumRef}
                />
                <input
                  type="text"
                  placeholder="Max Price"
                  name="maximum"
                  className="ms-1 form-control"
                  ref={maximumRef}
                />
              </div>
            </Form>
            {/* Form for submitting  category filter */}
            <Form className="d-flex ms-2">
              <Dropdown>
                <Dropdown.Toggle variant="primary">Category</Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item>Cat 1</Dropdown.Item>
                  <Dropdown.Item>Cat 2</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Form>
          </div>
          {/* END OF ADDED CODE */}
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={data.pages}
            page={data.page}
            keyword={keyword || ""}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;
