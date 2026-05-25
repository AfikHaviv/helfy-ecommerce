import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilter from '../components/product/ProductFilter';
import ProductSearch from '../components/product/ProductSearch';
import { productAPI } from '../api/product.api';
import { categoryAPI } from '../api/category.api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    sort: '',
    inStock: false,
    page: 1,
    limit: 12,
  });
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getCategories();
      if (response.success) {
        setCategories(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.sort) params.sort = filters.sort;
      if (filters.inStock) params.inStock = true;
      params.page = filters.page;
      params.limit = filters.limit;

      const response = await productAPI.getProducts(params);
      if (response.success) {
        setProducts(response.data || []);
        setPagination(response.pagination || null);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    if (key === 'clear') {
      setFilters({
        search: '',
        category: '',
        minPrice: '',
        maxPrice: '',
        sort: '',
        inStock: false,
        page: 1,
        limit: 12,
      });
    } else {
      setFilters({
        ...filters,
        [key]: value,
        page: 1, // Reset to first page when filters change
      });
    }
  };

  const handleSearchChange = (value) => {
    setFilters({
      ...filters,
      search: value,
      page: 1,
    });
  };

  const handlePageChange = (newPage) => {
    setFilters({
      ...filters,
      page: newPage,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Products</h1>
          <ProductSearch value={filters.search} onChange={handleSearchChange} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <ProductFilter
              filters={filters}
              onFilterChange={handleFilterChange}
              categories={categories}
            />
          </motion.div>

          {/* Products Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {pagination && `Showing ${products.length} of ${pagination.total} products`}
              </p>
            </div>

            <ProductGrid products={products} loading={loading} />

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page === 1}
                    className="px-3 py-2 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {[...Array(pagination.totalPages)].map((_, index) => {
                    const page = index + 1;
                    if (
                      page === 1 ||
                      page === pagination.totalPages ||
                      (page >= filters.page - 1 && page <= filters.page + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 rounded-md text-sm font-medium ${
                            page === filters.page
                              ? 'bg-primary-600 text-white'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (page === filters.page - 2 || page === filters.page + 2) {
                      return <span key={page} className="px-2">...</span>;
                    }
                    return null;
                  })}

                  <button
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={filters.page === pagination.totalPages}
                    className="px-3 py-2 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Products;
