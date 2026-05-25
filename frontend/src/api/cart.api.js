import axios from './axios';

export const cartAPI = {
  getCart: async () => {
    return await axios.get('/cart');
  },

  addItem: async (itemData) => {
    return await axios.post('/cart/items', itemData);
  },

  updateItem: async (id, itemData) => {
    return await axios.put(`/cart/items/${id}`, itemData);
  },

  removeItem: async (id) => {
    return await axios.delete(`/cart/items/${id}`);
  },

  clearCart: async () => {
    return await axios.delete('/cart');
  },

  mergeCart: async () => {
    return await axios.post('/cart/merge');
  },
};
