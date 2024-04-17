import { Spinner } from 'react-bootstrap';

const Loader = () => {
  return (
    <output>
      <Spinner
        animation="border"
        style={{
          width: '100px',
          height: '100px',
          margin: 'auto',
          display: 'block',
        }}
      ></Spinner>
    </output>
  );
};

export default Loader;