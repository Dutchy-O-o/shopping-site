import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom
import '../Styles/Cart.css';

interface CartItem {
  shoppingCartItemId: number;
  productName: string;
  quantity: number;
  price: number;
  gender: string;
  alt_url: string;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // useNavigate hook for navigation

  // Get customerId from localStorage
  const storedUserId = localStorage.getItem("userId");
  const customerId = storedUserId ? parseInt(storedUserId) : undefined;

  useEffect(() => {
    if (customerId) {
      // Fetch shoppingCartId using customerId
      fetch(`https://localhost:7192/api/ShoppingCart/find-shopping_cart_id-using-customer_id-via-function?CustomerId=${customerId}`)
        .then(response => response.json())
        .then((data) => {
          const shoppingCartId = data[0]?.shoppingCartId;
          if (shoppingCartId) {
            // Fetch cart items using shoppingCartId
            fetch(`https://localhost:7192/api/ShoppingCart/select-shopping_cart_items-using-shopping_cart_id-via-function?ShoppingCartId=${shoppingCartId}`)
              .then(response => response.json())
              .then((items: CartItem[]) => {
                setCartItems(items);
                setLoading(false);
              })
              .catch(err => {
                setError('Error fetching cart items.');
                setLoading(false);
              });
          }
        })
        .catch(err => {
          setError('Error fetching shopping cart.');
          setLoading(false);
        });
    }
  }, [customerId]);

  // Calculate total cost
  const totalCost = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your shopping cart is empty. Please add items to proceed.");
    } else {
      navigate('/checkout', {
        state: { totalCost }, // Pass totalCost here
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your shopping cart is empty. Please add items to proceed.</p>
      ) : (
        <ul>
          {cartItems.map(item => (
            <li key={item.shoppingCartItemId} className="cart-item">
              <img src={item.alt_url} alt={item.productName} width={100} height={100} />
              <div>{item.productName}</div>
              <div>Quantity: {item.quantity}</div>
              <div>Price: ${item.price}</div>
              <div>Gender: {item.gender}</div>
            </li>
          ))}
        </ul>
      )}
      <div className="total-cost">
        <h3>Total Cost: ${totalCost.toFixed(2)}</h3>
      </div>
      <button 
        className="order-button" 
        onClick={handleCheckout} 
        disabled={cartItems.length === 0} // Disable button if cart is empty
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default Cart;
