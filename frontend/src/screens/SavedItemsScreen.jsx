import { useDispatch, useSelector } from 'react-redux';
import { useGetSavedItemsQuery, useDeleteSavedItemMutation } from '../slices/savedItemsApiSlice';
import { addToCart } from '../slices/cartSlice';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { ListGroup, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

const SavedItemsScreen = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.cartItems);
  const { data: savedItems, isLoading, error } = useGetSavedItemsQuery();
  const [deleteSavedItem] = useDeleteSavedItemMutation();

  const handleRemoveFromSaved = async (itemId) => {
    try {
      await deleteSavedItem(itemId).unwrap();
      toast.success('Item removed!');
    } catch (err) {
        toast.error('Error removing from saved list.');
    }
  };

  const handleMoveToCart = (item) => {
    const existingItem = cartItems.find((cartItem) => cartItem._id === item._id);
  
    const quantity = existingItem ? existingItem.qty + 1 : 1;
  
    const itemToAdd = {
      ...item,
      qty: quantity
    };
  
    dispatch(addToCart(itemToAdd));
    toast.success('Item added to cart!');
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant='danger'>Error: {error.message}</Message>;

  return (
    <ListGroup>
      {savedItems?.items.map(item => (
        <ListGroup.Item key={item._id}>
          {item.product.name}
          <div className="float-right">
            <Button variant="primary" size="sm" onClick={() => handleMoveToCart(item.product)}>
              Move to Cart
            </Button>
            {' '}
            <Button variant="danger" size="sm" onClick={() => handleRemoveFromSaved(item._id)}>
              Remove
            </Button>
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default SavedItemsScreen;
