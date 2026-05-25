import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productAPI } from '../api/product.api';
import { formatCurrency } from '../utils/formatters';
import useCart from '../hooks/useCart';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getProductBySlug(slug);
      if (response.success && response.data) {
        setProduct(response.data);
      } else {
        setError('Product not found');
      }
    } catch (err) {
      setError(err.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    setAdding(true);
    const result = await addToCart(product.id, quantity);
    if (result.success) {
      navigate('/cart');
    }
    setAdding(false);
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stock_quantity) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ErrorMessage message={error} />
          <Button onClick={() => navigate('/products')} className="mt-4">
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const images = product.images || [];
  const primaryImage = images.find(img => img.is_primary) || images[0];
  const displayImage = images[selectedImage] || primaryImage || { image_url: 'https://via.placeholder.com/600x600?text=No+Image' };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm">
            <button
              onClick={() => navigate('/products')}
              className="text-primary-600 hover:text-primary-700"
            >
              Products
            </button>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-gray-700">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-lg overflow-hidden shadow-md mb-4"
              >
                <img
                  src={displayImage.image_url}
                  alt={product.name}
                  className="w-full h-[500px] object-cover"
                />
              </motion.div>

              {/* Thumbnail Images */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(index)}
                      className={`bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow ${
                        selectedImage === index ? 'ring-2 ring-primary-600' : ''
                      }`}
                    >
                      <img
                        src={image.image_url}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-24 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              {product.rating_average > 0 && (
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating_average)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating_average.toFixed(1)} ({product.rating_count} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline space-x-3">
                  <span className="text-4xl font-bold text-gray-900">
                    {formatCurrency(product.price)}
                  </span>
                  {product.compare_at_price && product.compare_at_price > product.price && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        {formatCurrency(product.compare_at_price)}
                      </span>
                      <span className="bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
                        {Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stock_quantity > 0 ? (
                  <p className="text-green-600 font-medium">
                    In Stock ({product.stock_quantity} available)
                  </p>
                ) : (
                  <p className="text-red-600 font-medium">Out of Stock</p>
                )}
              </div>

              {/* Quantity Selector */}
              {product.stock_quantity > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span className="text-xl font-semibold w-12 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock_quantity}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  variant="primary"
                  size="lg"
                  loading={adding}
                  disabled={product.stock_quantity === 0}
                  className="flex-1"
                >
                  {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
                <Button
                  onClick={() => navigate('/products')}
                  variant="outline"
                  size="lg"
                  className="px-8"
                >
                  Continue Shopping
                </Button>
              </div>

              {/* Product Details */}
              <div className="mt-8 border-t pt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
                <dl className="space-y-2">
                  {product.sku && (
                    <div className="flex">
                      <dt className="text-gray-600 w-32">SKU:</dt>
                      <dd className="text-gray-900 font-medium">{product.sku}</dd>
                    </div>
                  )}
                  {product.weight && (
                    <div className="flex">
                      <dt className="text-gray-600 w-32">Weight:</dt>
                      <dd className="text-gray-900">{product.weight} kg</dd>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex">
                      <dt className="text-gray-600 w-32">Dimensions:</dt>
                      <dd className="text-gray-900">{product.dimensions}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;
