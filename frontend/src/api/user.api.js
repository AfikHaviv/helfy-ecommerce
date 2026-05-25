import axios from './axios';

export const userAPI = {
  getProfile: async () => {
    return await axios.get('/users/profile');
  },

  updateProfile: async (userData) => {
    return await axios.put('/users/profile', userData);
  },

  updatePassword: async (passwordData) => {
    return await axios.patch('/users/password', passwordData);
  },

  getAddresses: async () => {
    return await axios.get('/users/addresses');
  },

  createAddress: async (addressData) => {
    return await axios.post('/users/addresses', addressData);
  },

  updateAddress: async (id, addressData) => {
    return await axios.put(`/users/addresses/${id}`, addressData);
  },

  deleteAddress: async (id) => {
    return await axios.delete(`/users/addresses/${id}`);
  },

  setDefaultAddress: async (id) => {
    return await axios.patch(`/users/addresses/${id}/default`);
  },
};
