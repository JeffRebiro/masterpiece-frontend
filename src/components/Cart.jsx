import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on component mount
  useEffect(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartItems(Array.isArray(savedCart) ? savedCart : []);
    } catch (e) {
      console.error("Failed to parse cart data from localStorage", e);
      setCartItems([]);
    }
  }, []);

  // Save cart to localStorage whenever cartItems changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cartItems]);

  const handleQuantityChange = (index, delta) => {
    setCartItems(prev => {
      // Create a copy to avoid direct state mutation
      const updatedItems = [...prev];
      const item = updatedItems[index];

      // Only allow quantity change for sale items, not hire items
      if ('hire_price_per_day' in item || 'hire_price_per_hour' in item) {
        return prev;
      }

      // Ensure quantity does not drop below 1
      const newQuantity = Math.max(1, (item.quantity || 1) + delta);
      updatedItems[index] = { ...item, quantity: newQuantity };

      return updatedItems;
    });
  };

  const handleRemove = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleCheckout = () => {
    // You should navigate to the checkout page, not login
    navigate('/checkout/shipping-address'); 
  };

  // Compute the total price based on the correct item properties
  const total = cartItems.reduce((sum, item) => {
    if ('hire_price_per_day' in item || 'hire_price_per_hour' in item) {
      const hours = parseFloat(item.hours ?? 0);
      const days = parseFloat(item.days ?? 0);
      const perHour = parseFloat(item.hire_price_per_hour ?? 0);
      const perDay = parseFloat(item.hire_price_per_day ?? 0);
      return sum + (hours * perHour) + (days * perDay);
    } else {
      const quantity = parseFloat(item.quantity || 1);
      const price = parseFloat(item.price || 0);
      return sum + (quantity * price);
    }
  }, 0);

  return (
    <div className="container mt-5">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="list-group mb-4">
            {cartItems.map((item, index) => {
              const isHireItem = 'hire_price_per_day' in item || 'hire_price_per_hour' in item;
              let itemTotal = 0;
              if (isHireItem) {
                const hours = parseFloat(item.hours ?? 0);
                const days = parseFloat(item.days ?? 0);
                const perHour = parseFloat(item.hire_price_per_hour ?? 0);
                const perDay = parseFloat(item.hire_price_per_day ?? 0);
                itemTotal = (hours * perHour) + (days * perDay);
              } else {
                const quantity = parseFloat(item.quantity || 1);
                const price = parseFloat(item.price || 0);
                itemTotal = quantity * price;
              }

              return (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div style={{ flex: 1 }}>
                    <strong>{item.name}</strong>
                    <br />
                    {isHireItem ? (
                      <small>
                        {item.hours} hour(s), {item.days} day(s)
                      </small>
                    ) : (
                      <div className="d-flex align-items-center mt-2">
                        <button
                          className="btn btn-sm btn-dark"
                          onClick={() => handleQuantityChange(index, -1)}
                          disabled={item.quantity <= 1} // Disable button if quantity is 1
                        >
                          -
                        </button>
                        <span className="mx-2">{item.quantity || 1}</span>
                        <button
                          className="btn btn-sm btn-dark"
                          onClick={() => handleQuantityChange(index, 1)}
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div>
                      Ksh. {itemTotal.toFixed(2)}
                    </div>
                    <button className="btn btn-sm btn-danger mt-2" onClick={() => handleRemove(index)}>
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <h4>Total: Ksh. {total.toFixed(2)}</h4>
          <button className="btn btn-success mt-3" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;