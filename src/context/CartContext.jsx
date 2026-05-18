import { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);
const API = 'http://localhost:3001/api';

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const { token, user } = useAuth();

  const addToCart = (record) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === record.record_id);
      if (existing) {
        return prev.map((item) =>
          item.id === record.record_id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...record, id: record.record_id, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, item) => sum + item.retail_price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const checkout = async () => {
    if (!user || user.isBanned) throw new Error('Unauthorized or banned');
    const orderItems = cart.map(item => ({ record_id: item.id, quantity: item.quantity }));
    const res = await fetch(`${API}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ userId: user.id, items: orderItems })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Order failed');
    }
    clearCart();
    return await res.json();
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount, checkout }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}