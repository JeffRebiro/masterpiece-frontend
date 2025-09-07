import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../components/header.css';
import { CartContext } from '../components/CartContext';

const Header = () => {
  const { cartItems } = useContext(CartContext);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto';
  }, [isMobileMenuOpen]);

  return (
    <header className="header-area">
      <div className={`header-content-wrapper ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="header-logo">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
            <img src="/images/masterlogo.png" alt="Logo" />
          </Link>
        </div>

        <nav className="main-nav-wrapper">
          <Link to="/products" onClick={() => setIsMobileMenuOpen(false)}>Megamall</Link>
          <Link to="/courier" onClick={() => setIsMobileMenuOpen(false)}>Courier Services</Link>
          <Link to="/hire-items" onClick={() => setIsMobileMenuOpen(false)}>Items for Hire</Link>

          <div className="submenu">
            <button onClick={(e) => e.preventDefault()}>Categories</button>
            <ul>
              <li><Link to="/category/audio-video-equipment">Audio & Video Equipment</Link></li>
              <li><Link to="/category/bicycles-accessories">Bicycle & Accessories</Link></li>
              <li><Link to="/category/building-materials">Building Materials</Link></li>
              {/* Add more categories as needed */}
            </ul>
          </div>
        </nav>

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

          <Link to="/cart" className="cart-icon" onClick={() => setIsMobileMenuOpen(false)}>
            <i className="fas fa-shopping-cart"></i>
            {cartCount > 0 && <span>{cartCount}</span>}
          </Link>
        </div>

        <div className="menu-trigger" onClick={toggleMobileMenu}>
          <i className="fas fa-bars"></i>
        </div>
      </div>
    </header>
  );
};

export default Header;
