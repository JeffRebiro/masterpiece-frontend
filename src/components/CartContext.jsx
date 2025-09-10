import React, { createContext, useState, useEffect, useMemo, useContext } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    let storedCart = [];
    try {
      storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    } catch (e) {
      console.warn("Invalid cart data in localStorage", e);
    }
    setCartItems(Array.isArray(storedCart) ? storedCart : []);
    setCartLoading(false);
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Compute total price correctly by handling different item types
  const totalPrice = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      if ('hire_price_per_day' in item || 'hire_price_per_hour' in item) {
        // Handle hire items
        const hours = parseFloat(item.hours ?? 0);
        const days = parseFloat(item.days ?? 0);
        const perHour = parseFloat(item.hire_price_per_hour ?? 0);
        const perDay = parseFloat(item.hire_price_per_day ?? 0);
        return sum + (hours * perHour) + (days * perDay);
      } else {
        // Handle standard sale items
        const quantity = parseFloat(item.quantity || 1);
        const price = parseFloat(item.price || 0);
        return sum + (quantity * price);
      }
    }, 0);
  }, [cartItems]);

  // Add or update cart item
  const addToCart = (product, quantity = 1, hireDetails = {}) => {
    setCartItems(prevItems => {
      const existing = prevItems.find(item => item.id === product.id);
      if (existing) {
        // Update an existing item
        if ('hire_price_per_day' in product || 'hire_price_per_hour' in product) {
          // For hire items, use hireDetails
          return prevItems.map(item =>
            item.id === product.id ? { ...item, ...hireDetails } : item
          );
        } else {
          // For sale items, update quantity
          return prevItems.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
          );
        }
      } else {
        // Add a new item
        if ('hire_price_per_day' in product || 'hire_price_per_hour' in product) {
          return [...prevItems, { ...product, ...hireDetails }];
        } else {
          return [...prevItems, { ...product, quantity }];
        }
      }
    });
  };

  // Remove a specific item
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Clear all cart items
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      setCartItems,
      addToCart,
      removeFromCart,
      clearCart,
      totalPrice,
      cartLoading
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for easy consumption
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};