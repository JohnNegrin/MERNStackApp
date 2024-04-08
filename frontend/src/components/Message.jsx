import { Alert } from 'react-bootstrap';
import PropTypes from 'prop-types'

const Message = ({ variant, children }) => {
  return <Alert variant={variant}>{children}</Alert>;
};

// Define prop types for the component
Message.propTypes = {
  variant: PropTypes.string.isRequired, 
  children: PropTypes.node.isRequired,
};

export default Message;