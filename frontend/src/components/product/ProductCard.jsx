import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatCurrency } from '../../utils/formatters';
import Button from '../common/Button';
import useCart from '../../hooks/useCart';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [adding, setAdding] = React.useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    setAdding(true);
    await addToCart(product.id, 1);
    setAdding(false);
  };

  const primaryImage = product.images?.find(img => img.is_primary)?.image_url || 
                       product.images?.[0]?.image_url || 
                       'https://via.placeholder.com/300x300?text=No+Image';

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <Link to={`/products/${product.slug}`}>
        <div className="relative h-64 overflow-hidden bg-gray-200">
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.compare_at_price && product.compare_at_price > product.price && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
              {Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)}% OFF
            </div>
          )}
          {product.stock_quantity === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white text-lg font-semibold">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/products/${product.slug}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {product.short_description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.short_description}
          </p>
        )}

        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              {formatCurrency(product.price)}
            </span>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                {formatCurrency(product.compare_at_price)}
              </span>
            )}
          </div>
        </div>

        {product.rating_average > 0 && (
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-4 w-4 ${
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
              ({product.rating_count})
            </span>
          </div>
        )}

        <Button
          onClick={handleAddToCart}
          variant="primary"
          size="md"
          loading={adding}
          disabled={product.stock_quantity === 0}
          className="w-full"
        >
          {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
