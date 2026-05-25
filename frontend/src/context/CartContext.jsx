import React, { createContext, useReducer, useEffect } from 'react';
import { cartAPI } from '../api/cart.api';

export const CartContext = createContext();

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        items: action.payload,
        loading: false,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await cartAPI.getCart();
      if (response.success && response.data) {
        dispatch({ type: 'SET_CART', payload: response.data.items || [] });
      } else {
        dispatch({ type: 'SET_CART', payload: [] });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await cartAPI.addItem({ product_id: productId, quantity });
      if (response.success) {
        await fetchCart();
        return { success: true };
      }
      return { success: false, message: 'Failed to add item to cart' };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, message: error.message };
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await cartAPI.updateItem(itemId, { quantity });
      if (response.success) {
        await fetchCart();
        return { success: true };
      }
      return { success: false, message: 'Failed to update item' };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, message: error.message };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await cartAPI.removeItem(itemId);
      if (response.success) {
        await fetchCart();
        return { success: true };
      }
      return { success: false, message: 'Failed to remove item' };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, message: error.message };
    }
  };

  const clearCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await cartAPI.clearCart();
      if (response.success) {
        dispatch({ type: 'CLEAR_CART' });
        return { success: true };
      }
      return { success: false, message: 'Failed to clear cart' };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, message: error.message };
    }
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => {
      return total + (item.price_at_addition * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    items: state.items,
    loading: state.loading,
    error: state.error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    fetchCart,
    getCartTotal,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
