import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';

const Cart = () => {
  const navigate = useNavigate();
  // Get all cart data and functions from the centralized context
  const { cartItems, totalPrice, removeFromCart, addToCart } = useCart();

  const handleQuantityChange = (item, delta) => {
    // Only allow quantity changes for items that are not for hire
    if (!('hire_price_per_day' in item || 'hire_price_per_hour' in item)) {
      // Find the existing quantity and calculate the new one
      const currentQuantity = item.quantity || 1;
      const newQuantity = Math.max(1, currentQuantity + delta);

      // Call the addToCart function with the updated quantity
      addToCart({ ...item, quantity: newQuantity }, newQuantity - currentQuantity);
    }
  };

  const handleRemove = (item) => {
    removeFromCart(item.id);
  };

  const handleCheckout = () => {
    navigate('/checkout/shipping-address');
  };

  return (
    <div className="container mt-5">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="list-group mb-4">
            {cartItems.map((item) => {
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
                  key={item.id}
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
                          onClick={() => handleQuantityChange(item, -1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="mx-2">{item.quantity || 1}</span>
                        <button
                          className="btn btn-sm btn-dark"
                          onClick={() => handleQuantityChange(item, 1)}
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
                    <button className="btn btn-sm btn-danger mt-2" onClick={() => handleRemove(item)}>
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <h4>Total: Ksh. {totalPrice.toFixed(2)}</h4>
          <button className="btn btn-success mt-3" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;