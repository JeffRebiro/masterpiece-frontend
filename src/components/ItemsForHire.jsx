import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// Helper function to build correct image URL
const getImageUrl = (image) => {
  if (!image) return "";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  if (image.startsWith("/media/")) return `https://e-commerce-backend-7yft.onrender.com${image}`;
  return `https://e-commerce-backend-7yft.onrender.com/media/hire_items/${image}`;
};

const ItemsForHire = () => {
  const [hireItems, setHireItems] = useState([]);

  useEffect(() => {
    axios.get("https://e-commerce-backend-7yft.onrender.com/api/hire-items/")
      .then((response) => {
        const data = response.data;

        const items = Array.isArray(data.results)
          ? data.results
          : Array.isArray(data.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];

        if (!Array.isArray(items)) {
          console.error("Expected array, got:", typeof items, items);
          setHireItems([]);
        } else {
          setHireItems(items);
        }
      })
      .catch((error) => {
        console.error("Error fetching hire items:", error);
        setHireItems([]);
      });
  }, []);

  return (
    <section className="section" id="hire-items">
      <div className="container">
        <div className="row mb-4">
          <div className="col-lg-6">
            <div className="section-heading">
              <h2>Items for Hire</h2>
              <span>Affordable hourly and daily rentals just for you.</span>
            </div>
          </div>
        </div>

        <div className="row">
          {hireItems.map((item) => (
            <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={item.id}>
              <div className="item">
                <Link to={`/hire-item/${item.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="thumb position-relative">
                    <div style={{
                      width: "100%",
                      height: "390px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      borderRadius: "12px",
                      border: "1px solid #ddd",
                      backgroundColor: "#f9f9f9"
                    }}>
                      <img
                        src={getImageUrl(item.image_url)}
                        alt={item.name}
                        crossOrigin="anonymous"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain"
                        }}
                      />
                    </div>
                  </div>

                  <div className="down-content mt-2">
                    <h4 style={{ color: "black", fontWeight: "bold" }}>
                      {item.name || "Unnamed Item"}
                    </h4>
                    <span>Ksh. {item.hire_price_per_hour}/hr</span><br />
                    <span>Ksh. {item.hire_price_per_day}/day</span>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ItemsForHire;
