import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_BASE_URL = "https://e-commerce-backend-7yft.onrender.com/api/products/";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(API_BASE_URL)
      .then((response) => {
        // Adjust according to your API's response structure
        const productData = response.data.results || response.data.data || response.data;
        if (Array.isArray(productData)) {
          setProducts(productData);
        } else {
          console.error("API response is not an array:", response.data);
          setProducts([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setProducts([]);
      });
  }, []);

  return (
    <section className="section" id="men">
      <div className="container">
        {/* Heading */}
        <div className="row mb-4">
          <div className="col-lg-6">
            <div className="section-heading">
              <h2>Our Latest...</h2>
              <span>
                Details to details is what makes Megamall different from others.
              </span>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="row">
          {products.map((item) => (
            <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={item.id}>
              <div className="item">
                <div className="thumb position-relative">
                  <div className="hover-content">
                    <ul>
                      <li>
                        <Link to={`/product/${item.id}`}>
                          <i className="fa fa-eye"></i>
                        </Link>
                      </li>
                      <li>
                        <Link to={`/product/${item.id}`}>
                          <i className="fa fa-star"></i>
                        </Link>
                      </li>
                      <li>
                        <Link to={`/product/${item.id}`}>
                          <i className="fa fa-shopping-cart"></i>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div
                    style={{
                      width: "100%",
                      height: "390px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      borderRadius: "12px",
                      border: "1px solid #ddd",
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        crossOrigin="anonymous"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                        }}
                      />
                    )}
                  </div>
                </div>

                <div className="down-content">
                  <h4 style={{ color: "black", fontWeight: "bold" }}>
                    <Link
                      to={`/product/${item.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {item.name || "No name"}
                    </Link>
                  </h4>
                  <span>Ksh. {item.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductList;
