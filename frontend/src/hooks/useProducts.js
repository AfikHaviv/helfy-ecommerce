import { useState, useEffect } from 'react';
import { productAPI } from '../api/product.api';

const useProducts = (initialParams = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [params, setParams] = useState(initialParams);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productAPI.getProducts(params);
        setProducts(response.data || []);
        setPagination(response.pagination || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [params]);

  const refetch = (newParams = {}) => {
    setParams({ ...params, ...newParams });
  };

  return { products, loading, error, pagination, refetch, setParams };
};

export default useProducts;
