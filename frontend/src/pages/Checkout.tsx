import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../Styles/Checkout.css';

const Checkout: React.FC = () => {
  const location = useLocation();
  const [totalCost, setTotalCost] = useState<number | null>(null);

  useEffect(() => {
    if (location.state && location.state.totalCost !== undefined) {
      setTotalCost(location.state.totalCost);
    }
  }, [location.state]);

  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [ccv, setCcv] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [shoppingCartId, setShoppingCartId] = useState<number | null>(null);
  const navigate = useNavigate();
  const months = Array.from({ length: 12 }, (_, index) => (index + 1).toString().padStart(2, '0'));
  const years = Array.from({ length: 16 }, (_, index) => (2025 + index).toString());

  useEffect(() => {
    const fetchShoppingCartId = async () => {
      const storedUserId = localStorage.getItem("userId");
      if (!storedUserId) {
        setError('User not logged in');
        return;
      }

      const customerId = parseInt(storedUserId);
      try {
        const response = await fetch(`https://localhost:7192/api/ShoppingCart/find-shopping_cart_id-using-customer_id-via-function?CustomerId=${customerId}`);
        const data = await response.json();
        if (data.length > 0) {
          setShoppingCartId(data[0].shoppingCartId);
        } else {
          setError('Shopping cart not found');
        }
      } catch (error) {
        setError('Error fetching shopping cart');
      }
    };

    fetchShoppingCartId();
  }, []);

  const formatCardNumber = (value: string) => {
    const formatted = value.replace(/\D/g, '').slice(0, 16); // Only digits and max length 16
    const groups = [];
    for (let i = 0; i < formatted.length; i += 4) {
      groups.push(formatted.slice(i, i + 4));
    }
    return groups.join(' ');
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCardNumber(formatCardNumber(value));
  };

  const validateCardNumber = (number: string) => {
    const regex = /^(\d{4} \d{4} \d{4} \d{4})$/;
    return regex.test(number);
  };

  const validateCcv = (ccv: string) => {
    const regex = /^\d{3}$/;
    return regex.test(ccv);
  };

  const handlePayment = async () => {
    if (!cardNumber || !expiryMonth || !expiryYear || !ccv || !paymentMethod) {
      setError('Please fill in all fields.');
      return;
    }

    if (!validateCardNumber(cardNumber)) {
      setError('Invalid card number. Please enter in 4 4 4 4 format.');
      return;
    }

    if (!validateCcv(ccv)) {
      setError('Invalid CCV. Please enter a 3-digit CCV.');
      return;
    }

    if (!shoppingCartId) {
      setError('Shopping cart ID not found.');
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:7192/api/ShoppingCartItem/procedure-remove-from-cart-add-to-new-order?input_ShoppingCartId=${shoppingCartId}&input_PaymentMethod=${paymentMethod}&input_CardNumber=${cardNumber.replace(/\s+/g, '')}`,
        {
          method: 'POST',
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert('Payment processed and order created!');
        handleClear();
        navigate('/');  // Navigate to HomePage
      } else {
        setError(data.message || 'Error processing payment');
      }
    } catch (error) {
      setError('Error processing payment');
    }
  };

  const handleClear = () => {
    setCardNumber('');
    setExpiryMonth('');
    setExpiryYear('');
    setCcv('');
    setPaymentMethod('');
    setError(null);
  };

  return (
    <div className="checkout-container">
      {/* Total Section */}
      <div className="total-section">
        <h1>Checkout</h1>
        <h2>Total to Pay: ${totalCost !== null ? totalCost.toFixed(2) : 'Loading...'}</h2>
        {error && <div className="error">{error}</div>}
      </div>

      {/* Form Section */}
      <div className="form-section">
        <form>
          <div className="input-group">
            <label>Card Number</label>
            <input
              type="text"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="Enter card number"
              maxLength={19} // 16 digits + 3 spaces
            />
          </div>

          {/* Expiry Month Dropdown */}
          <div className="input-group">
            <label>Expiry Month</label>
            <select value={expiryMonth} onChange={(e) => setExpiryMonth(e.target.value)}>
              <option value="" disabled>Select Month</option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          {/* Expiry Year Dropdown */}
          <div className="input-group">
            <label>Expiry Year</label>
            <select value={expiryYear} onChange={(e) => setExpiryYear(e.target.value)}>
              <option value="" disabled>Select Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>CCV</label>
            <input
              type="text"
              value={ccv}
              onChange={(e) => setCcv(e.target.value)}
              placeholder="Enter CCV"
              maxLength={3}
            />
          </div>

          {/* Payment Method Dropdown */}
          <div className="input-group">
            <label>Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="" disabled>Select Payment Method</option>
              <option value="creditCard">Credit Card</option>
              <option value="debitCard">Debit Card</option>
            </select>
          </div>

          <div className="button-group">
            <button type="button" onClick={handleClear}>Clear</button>
            <button type="button" onClick={handlePayment}>Pay Now</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
