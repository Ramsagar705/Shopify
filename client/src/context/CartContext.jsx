import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);

  const refreshCart = async () => {
    if (!user) {
      setCart(null);
      return;
    }
    const res = await api.get('/cart');
    setCart(res.data);
  };

  useEffect(() => {
    refreshCart().catch(() => setCart(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id || user?._id]);

  const addToCart = async (productId, quantity = 1) => {
    await api.post('/cart', { productId, quantity });
    await refreshCart();
  };

  const updateCartItem = async (productId, quantity) => {
    await api.put('/cart', { productId, quantity });
    await refreshCart();
  };

  const removeFromCart = async (productId) => {
    await api.delete(`/cart/item/${productId}`);
    await refreshCart();
  };

  return (
    <CartContext.Provider
      value={{ cart, refreshCart, addToCart, updateCartItem, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

