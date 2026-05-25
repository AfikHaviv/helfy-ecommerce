import axios from './axios';

export const categoryAPI = {
  getCategories: async () => {
    return await axios.get('/categories');
  },

  getCategoryById: async (id) => {
    return await axios.get(`/categories/${id}`);
  },

  getCategoryProducts: async (id, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await axios.get(`/categories/${id}/products${queryString ? `?${queryString}` : ''}`);
  },

  createCategory: async (categoryData) => {
    return await axios.post('/categories', categoryData);
  },

  updateCategory: async (id, categoryData) => {
    return await axios.put(`/categories/${id}`, categoryData);
  },

  deleteCategory: async (id) => {
    return await axios.delete(`/categories/${id}`);
  },
};
