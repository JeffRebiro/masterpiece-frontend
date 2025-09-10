import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../components/CartContext";

const getImageUrl = (image) => {
  if (!image) return "";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  if (image.startsWith("/media/")) return `https://e-commerce-backend-7yft.onrender.com${image}`;
  return `https://e-commerce-backend-7yft.onrender.com/media/hire_items/${image}`;
};

const ItemsForHireDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [hours, setHours] = useState(1);
  const [days, setDays] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  // Use the useCart hook to access the context functions
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    axios
      .get(`https://e-commerce-backend-7yft.onrender.com/api/hire-items/${id}/`)
      .then((res) => {
        setItem(res.data);
      })
      .catch((err) => console.error("Error fetching hire item details:", err));
  }, [id]);

  const handleAddToCart = () => {
    if (!item || !item.id) return;

    // Use the addToCart function from CartContext to add the hire item
    addToCart(item, 1, { 
      hours: hours, 
      days: days, 
      hire_price_per_hour: item.hire_price_per_hour,
      hire_price_per_day: item.hire_price_per_day 
    });
    
    setShowPopup(true);
  };

  const handleContinueBrowsing = () => {
    setShowPopup(false);
    navigate("/hire-items");
  };

  const handleGoToCart = () => {
    setShowPopup(false);
    navigate("/cart");
  };

  if (!item) return <div className="container">Loading hire item...</div>;

  return (
    <section className="section" id="hire-item">
      <div className="container">
        <div className="row">
          {/* Image */}
          <div className="col-lg-8">
            <div className="left-images">
              <div
                style={{
                  width: "100%",
                  maxHeight: "500px",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "12px",
                  border: "1px solid #ddd",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <img
                  src={getImageUrl(item.image_url)}
                  alt={item.name}
                  loading="lazy"
                  style={{
                    maxHeight: "350px",
                    maxWidth: "350px",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="col-lg-4">
            <div className="right-content">
              <h4>{item.name}</h4>
              <span className="price">
                Hour: Ksh. {item.hire_price_per_hour} | Day: Ksh. {item.hire_price_per_day}
              </span>

              <p className="mt-2">{item.details || "No description provided."}</p>

              <div className="quote">
                <i className="fa fa-quote-left"></i>
                <p>Flexible hourly and daily hire rates available.</p>
              </div>

              <div className="quantity-content mt-3">
                <div className="left-content">
                  <h6>Duration</h6>
                </div>
                <div className="right-content d-flex gap-2 flex-wrap">
                  <div className="quantity buttons_added">
                    <label>Hours</label>
                    <input
                      type="number"
                      value={hours}
                      min="0"
                      onChange={(e) =>
                        setHours(Math.max(0, parseInt(e.target.value) || 0))
                      }
                      className="input-text qty text"
                      style={qtyStyle}
                    />
                  </div>
                  <div className="quantity buttons_added">
                    <label>Days</label>
                    <input
                      type="number"
                      value={days}
                      min="0"
                      onChange={(e) =>
                        setDays(Math.max(0, parseInt(e.target.value) || 0))
                      }
                      className="input-text qty text"
                      style={qtyStyle}
                    />
                  </div>
                </div>
              </div>

              <div className="total mt-4">
                <h4>
                  Total: Ksh.{" "}
                  {(
                    hours * parseFloat(item.hire_price_per_hour) +
                    days * parseFloat(item.hire_price_per_day)
                  ).toFixed(2)}
                </h4>
                <div className="main-border-button mt-2">
                  <button className="btn btn-primary" onClick={handleAddToCart}>
                    Book
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal popup */}
      {showPopup && (
        <div
          className="modal fade show"
          tabIndex="-1"
          style={{
            display: "block",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Item Added to Cart</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowPopup(false)}
                />
              </div>
              <div className="modal-body">
                <p>What would you like to do next?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleContinueBrowsing}>
                  Continue Browsing
                </button>
                <button className="btn btn-primary" onClick={handleGoToCart}>
                  Go to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const qtyStyle = {
  backgroundColor: "black",
  color: "white",
  fontWeight: "bold",
  textAlign: "center",
  width: "60px",
  margin: "0 5px",
};

export default ItemsForHireDetails;