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

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

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
            <Form className="d-flex">
              <Button type="submit" className="me-1">
                Filter
              </Button>

              <div className="d-flex">
                <Form.Control
                  placeholder="Min Price"
                  className="me-1 "
                ></Form.Control>
                <Form.Control
                  placeholder="Max Price"
                  className="ms-1"
                ></Form.Control>
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
            {data.products.map((product) => (
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
