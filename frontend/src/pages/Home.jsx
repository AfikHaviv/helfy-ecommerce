import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductGrid from '../components/product/ProductGrid';
import { productAPI } from '../api/product.api';
import { categoryAPI } from '../api/category.api';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productAPI.getFeaturedProducts(),
          categoryAPI.getCategories(),
        ]);
        if (productsRes.success) {
          setFeaturedProducts(productsRes.data?.products || []);
        }
        if (categoriesRes.success) {
          setCategories((categoriesRes.data?.categories || []).slice(0, 6));
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-6">Welcome to Helfy</h1>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Discover thousands of products at unbeatable prices. Shop electronics, fashion, home & more.
            </p>
            <Link
              to="/products"
              className="inline-block bg-white text-primary-700 font-semibold px-8 py-3 rounded-lg hover:bg-primary-50 transition-colors"
            >
              Shop Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-gray-900 mb-8 text-center"
            >
              Shop by Category
            </motion.h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={`/products?category=${category.id}`}
                    className="block bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                  >
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{category.name}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold text-gray-900"
            >
              Featured Products
            </motion.h2>
            <Link
              to="/products"
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              View all &rarr;
            </Link>
          </div>
          <ProductGrid products={featuredProducts.slice(0, 8)} loading={loading} />
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to find something great?</h2>
            <p className="text-gray-400 mb-8">Browse our full catalog and discover deals across all categories.</p>
            <Link
              to="/products"
              className="inline-block bg-primary-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Browse All Products
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
