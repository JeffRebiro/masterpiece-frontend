import React, { useState } from 'react';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const Confirmation = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user, shippingAddress, placeOrder } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      setError('Please select a payment method.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderResponse = await placeOrder({
        cartItems,
        shippingAddress,
        user,
        totalPrice,
        paymentMethod,
      });

      const orderId =
        typeof orderResponse === 'string'
          ? orderResponse
          : orderResponse?.id || orderResponse?.orderId;

      if (!orderId) throw new Error('Invalid order response');

      clearCart();

      navigate('/payment-redirect', {
        state: {
          paymentMethod,
          orderId,
          phoneNumber: shippingAddress?.phoneNumber || user?.phoneNumber || '',
        },
      });
    } catch (err) {
      console.error('Error placing order:', err);
      setError(`Failed to place order: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const renderDeliveryInfo = () => {
    if (!shippingAddress) return null;

    const isPickup = shippingAddress.deliveryOption === 'pickup';
    const storeMap = {
      '9': 'Afya Business Plaza (Near Globe Roundabout)',
      '10': 'Ghale House (Behind The Clarion Hotel)',
    };

    return (
      <>
        <h3>{isPickup ? 'Pickup from' : 'Deliver to'}</h3>
        <p>
          {isPickup
            ? storeMap[shippingAddress.storeId]
            : `${shippingAddress.street}, ${shippingAddress.city}`}
        </p>
        <h4>Contact</h4>
        <p>
          Name: {shippingAddress.firstName} <br />
          Phone: {shippingAddress.phoneNumber} <br />
          Email: {user?.email}
        </p>
      </>
    );
  };

  return (
    <div className="container mt-4">
      <nav className="nav checkout-nav mb-4 flex-wrap">
        <a href="/checkout/shipping-address/" className="nav-link step1 visited">
          1. Delivery address
        </a>
        <a href="/checkout/confirmation/" className="nav-link step2 active">
          2. Confirmation
        </a>
      </nav>

      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Left Column */}
          <div className="col-lg-8 mb-4">
            {/* Payment Method */}
            <div className="card checkout-preview-card mb-4">
              <div className="card-body">
                <h3 className="mb-3">Pay with</h3>
                <div className="form-group">
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="payment-tingg"
                      value="tingg"
                      checked={paymentMethod === 'tingg'}
                      onChange={() => setPaymentMethod('tingg')}
                    />
                    <label className="form-check-label" htmlFor="payment-tingg">
                      Credit/debit cards & mobile money
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="payment-mpesa"
                      value="mpesa"
                      checked={paymentMethod === 'mpesa'}
                      onChange={() => setPaymentMethod('mpesa')}
                    />
                    <label className="form-check-label" htmlFor="payment-mpesa">
                      Safaricom M-Pesa
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Contents */}
            <div className="card checkout-preview-card">
              <div className="checkout-preview-card-actions text-end p-2">
                <a href="/basket/" className="btn btn-link" title="Edit order contents">
                  <small>Edit</small>
                </a>
              </div>
              <div className="card-body">
                <h2>Order contents</h2>
                {cartItems.map((item) => {
                  const isHireItem =
                    "hire_price_per_day" in item || "hire_price_per_hour" in item;
                  const name = item.name;
                  const image = item.image;
                  let quantityDisplay;
                  let itemTotal = 0;

                  if (isHireItem) {
                    const duration = item.duration || 1;
                    const durationType = item.durationType || "day";
                    const rate =
                      durationType === "hour"
                        ? item.hire_price_per_hour || 0
                        : item.hire_price_per_day || 0;
                    itemTotal = duration * rate;
                    quantityDisplay = `${duration} ${durationType}(s)`;
                  } else {
                    const quantity = item.quantity || 1;
                    const price = item.price || 0;
                    itemTotal = price * quantity;
                    quantityDisplay = quantity;
                  }

                  return (
                    <div className="basket-line row py-2 align-items-center" key={item.id}>
                      <div className="col-7 d-flex align-items-center">
                        <img
                          src={image}
                          alt={name}
                          className="img-thumbnail me-2"
                          style={{ width: "70px" }}
                        />
                        <h6 className="mb-0">{name}</h6>
                      </div>
                      <div className="col-2 text-end">{quantityDisplay}</div>
                      <div className="col-3 text-end">KES {itemTotal}</div>
                    </div>
                  );
                })}

                <hr />
                <table className="table table-bordered table-sm mt-3">
                  <tbody>
                    <tr>
                      <th>Basket total</th>
                      <td>KES {totalPrice}</td>
                    </tr>
                    <tr>
                      <th>Delivery</th>
                      <td>KES 0</td>
                    </tr>
                    <tr className="table-success">
                      <th>Order total</th>
                      <td><strong>KES {totalPrice}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-lg-4 mb-4">
            {/* Delivery Info */}
            <div className="card checkout-preview-card mb-4">
              <div className="checkout-preview-card-actions text-end p-2">
                <a
                  href="/checkout/shipping-address/"
                  className="btn btn-link"
                  title="Change delivery address"
                >
                  <small>Edit</small>
                </a>
              </div>
              <div className="card-body">{renderDeliveryInfo()}</div>
            </div>

            {/* Place Order */}
            <div className="card checkout-preview-card">
              <div className="card-body">
                <h3>Place order</h3>
                <p className="lead">Your order total is KES {totalPrice}</p>
                <p className="checkout-terms">
                  By placing an order you agree to the{' '}
                  <a href="/terms-and-conditions/" target="_blank" rel="noreferrer">
                    terms and conditions
                  </a>.
                </p>
                {error && <p className="text-danger">{error}</p>}
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={!paymentMethod || loading}
                >
                  {loading ? 'Placing order...' : 'Place order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Confirmation;
