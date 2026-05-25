import axios from './axios';

export const orderAPI = {
  getOrders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await axios.get(`/orders${queryString ? `?${queryString}` : ''}`);
  },

  getOrderById: async (id) => {
    return await axios.get(`/orders/${id}`);
  },

  createOrder: async (orderData) => {
    return await axios.post('/orders', orderData);
  },

  cancelOrder: async (id) => {
    return await axios.patch(`/orders/${id}/cancel`);
  },

  getInvoice: async (id) => {
    return await axios.get(`/orders/${id}/invoice`);
  },
};
