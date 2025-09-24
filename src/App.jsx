import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Banner from './components/Banner';
import ProductList from './components/ProductList';
import ProductDetail from "./components/ProductDetail";
import Cart from './components/Cart';
import Login from './components/Login';
import ShippingAddress from './components/ShippingAddress';
import CategoryPage from './components/CategoryPage';
import Socials from './components/Socials';
import Footer from './components/Footer';
import SearchResults from './components/SearchResults';
import Confirmation from './components/Confirmation';
import PaymentRedirect from "./components/PaymentRedirect";
import { CartProvider } from './components/CartContext';
import { AuthProvider } from './components/AuthContext';
import Home from './components/Home';
import Courier from "./components/Courier";
import ItemsForHire from "./components/ItemsForHire";
import ItemsForHireDetails from "./components/ItemsForHireDetails";
import './App.css';
import Admin from './components/Admin';
import './components/Admin.css';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <CartProvider>
        <AuthProvider>
          {loading ? (
            <div className="loader">
              <div className="spinner"></div>
            </div>
          ) : (
            <AppContent />
          )}
        </AuthProvider>
      </CartProvider>
    </Router>
  );
}
//----------------------------------------------------------------------------------------------------
function AppContent() {
  const location = useLocation();

  const hideBanner = [
    '/',
    '/hire-items',
    '/cart',
    '/courier',
    '/search',
    '/category',
    '/login',
    '/checkout/shipping-address/',
    '/checkout/confirmation/',
    '/order-success/',
    '/payment-redirect',
    '/admin' // New Path
  ].some(path => location.pathname.startsWith(path));

  return (
    <>
      <Header />
      {!hideBanner && <Banner />}
      <main style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/checkout/shipping-address/" element={<ShippingAddress />} />
          <Route path="/checkout/confirmation/" element={<Confirmation />} />
          <Route path="/courier/" element={<Courier />} />
          <Route path="/payment-redirect" element={<PaymentRedirect />} />
          <Route path="/order-success/:orderId" element={<PaymentRedirect />} />
          <Route path="/hire-items" element={<ItemsForHire />} />
          <Route path="/hire-item/:id" element={<ItemsForHireDetails />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Socials />
      <Footer />
    </>
  );
}

export default App;