import axios from './axios';

export const authAPI = {
  signup: async (userData) => {
    return await axios.post('/auth/signup', userData);
  },

  login: async (credentials) => {
    return await axios.post('/auth/login', credentials);
  },

  logout: async () => {
    return await axios.post('/auth/logout');
  },

  getMe: async () => {
    return await axios.get('/auth/me');
  },

  refreshToken: async () => {
    return await axios.post('/auth/refresh-token');
  },

  forgotPassword: async (email) => {
    return await axios.post('/auth/forgot-password', { email });
  },

  resetPassword: async (token, password) => {
    return await axios.post('/auth/reset-password', { token, password });
  },
};
