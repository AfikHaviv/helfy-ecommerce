import axios from './axios';

export const productAPI = {
  getProducts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await axios.get(`/products${queryString ? `?${queryString}` : ''}`);
  },

  getFeaturedProducts: async () => {
    return await axios.get('/products/featured');
  },

  getProductById: async (id) => {
    return await axios.get(`/products/${id}`);
  },

  getProductBySlug: async (slug) => {
    return await axios.get(`/products/slug/${slug}`);
  },

  createProduct: async (productData) => {
    return await axios.post('/products', productData);
  },

  updateProduct: async (id, productData) => {
    return await axios.put(`/products/${id}`, productData);
  },

  deleteProduct: async (id) => {
    return await axios.delete(`/products/${id}`);
  },
};
