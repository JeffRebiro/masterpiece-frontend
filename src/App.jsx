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

// ✅ Admin imports
import Admin from './admin/Admin';
import Dashboard from './admin/Dashboard';
import CRUDTable from './admin/CRUDTable';
import AdminLogin from './admin/Login';
import AdminRegister from './admin/Register';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

// ----------------------------------------------------------------------------------------------------

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
    '/admin'
  ].some(path => location.pathname.startsWith(path));

  return (
    <>
      <Header />
      {!hideBanner && <Banner />}
      <main style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <Routes>
          {/* Existing routes */}
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

          {/* ✅ Admin routes */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/products" element={<CRUDTable endpoint="products" />} />
          <Route path="/admin/categories" element={<CRUDTable endpoint="categories" />} />
          <Route path="/admin/hire-items" element={<CRUDTable endpoint="hire-items" />} />
          <Route path="/admin/guest-users" element={<CRUDTable endpoint="guest-users" />} />
          <Route path="/admin/shipping-addresses" element={<CRUDTable endpoint="shipping-addresses" />} />
        </Routes>
      </main>
      <Socials />
      <Footer />
    </>
  );
}

export default App;
