import React, { createContext, useReducer, useEffect } from 'react';
import { authAPI } from '../api/auth.api';

export const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authAPI.getMe();
      if (response.success && response.data) {
        dispatch({ type: 'SET_USER', payload: response.data });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      if (response.success && response.data) {
        dispatch({ type: 'SET_USER', payload: response.data.user });
        return { success: true };
      }
      return { success: false, message: 'Login failed' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authAPI.signup(userData);
      if (response.success && response.data) {
        dispatch({ type: 'SET_USER', payload: response.data.user });
        return { success: true };
      }
      return { success: false, message: 'Signup failed' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      dispatch({ type: 'LOGOUT' });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const value = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    login,
    signup,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
