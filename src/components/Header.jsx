import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../components/header.css";
import { CartContext } from "../components/CartContext";

const Header = () => {
  const { cartItems } = useContext(CartContext);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="header-area">
      <div
        className={`header-content-wrapper ${
          isMobileMenuOpen ? "active" : ""
        }`}
      >
        <div className="header-logo">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
            <img src="/images/masterlogo.png" alt="Logo" />
          </Link>
        </div>

        {/* Hamburger Icon */}
        <div className="menu-trigger" onClick={toggleMobileMenu}>
          <i className="fas fa-bars"></i>
        </div>

        <nav className="main-nav-wrapper">
          <ul className="nav-links">
            <li>
              <Link
                to="/products"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Megamall
              </Link>
            </li>
            <li>
              <Link
                to="/courier"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Courier Services
              </Link>
            </li>
            <li>
              <Link
                to="/hire-items"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Items for Hire
              </Link>
            </li>

            {/* Categories Dropdown */}
            <li className={`submenu ${isCategoriesOpen ? "open" : ""}`}>
              <button
                type="button"
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="submenu-toggle"
              >
                Categories{" "}
                <i
                  className={`fas fa-chevron-${
                    isCategoriesOpen ? "up" : "down"
                  }`}
                ></i>
              </button>
              <ul>
                <li>
                  <Link
                    to="/category/audio-video-equipment"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Audio & Video Equipment
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/bicycles-accessories"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Bicycle & Accessories
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/building-materials"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Building Materials
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/computer-accessories"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Computer Accessories
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/clothing"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Clothing
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/clothing-accessories"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Clothing Accessories
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/furniture"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Furniture
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/garden-supplies"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Garden Supplies
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/home-appliances"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home Appliances
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/household-chemicals"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Household Chemicals
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/laptops-computers"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Laptops & Computers
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/medical-equipment-supplies"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Medical Equipment & Supplies
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/networking-products"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Networking Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/kids-accessories"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Kids Accessories
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/plumbing-water-systems"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Plumbing & Water Systems
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/printing-services"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Printing Services
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/safety-equipment-protective-gear"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Safety Equipment & Protective Gear
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/sports-equipment"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sports Equipment
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/salon-equipment"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Salon Equipment
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/stationery-office-equipment"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Stationery and Office Equipment
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/skincare"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Skincare
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/tools-accessories"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Tools & Accessories
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/vehicle-parts-accessories"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Vehicle Parts & Accessories
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/wedding-accessories"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Wedding Accessories
                  </Link>
                </li>
              </ul>
            </li>
          </ul>

          <div className="search-cart-group">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit">
                <i className="fas fa-search"></i>
              </button>
            </form>

            <Link
              to="/cart"
              className="cart-icon"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fas fa-shopping-cart"></i>
              {cartCount > 0 && <span>{cartCount}</span>}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
