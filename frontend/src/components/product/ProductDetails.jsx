import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import { formatCurrency } from '../../utils/formatters';

const ProductDetails = ({ product, onAddToCart, loading }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock_quantity) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    onAddToCart(product.id, quantity);
  };

  const images = product.images || [];
  const inStock = product.stock_quantity > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Image Gallery */}
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="aspect-square rounded-lg overflow-hidden bg-gray-100"
        >
          <img
            src={images[selectedImage]?.image_url || '/placeholder.jpg'}
            alt={images[selectedImage]?.alt_text || product.name}
            className="w-full h-full object-cover"
          />
        </motion.div>
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-4">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square rounded-lg overflow-hidden border-2 ${
                  selectedImage === index
                    ? 'border-indigo-600'
                    : 'border-gray-200'
                }`}
              >
                <img
                  src={image.image_url}
                  alt={image.alt_text}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {product.name}
          </h1>
          {product.short_description && (
            <p className="text-gray-600">{product.short_description}</p>
          )}
        </div>

        <div className="flex items-baseline gap-4">
          <span className="text-3xl font-bold text-gray-900">
            {formatCurrency(product.price)}
          </span>
          {product.compare_at_price && product.compare_at_price > product.price && (
            <span className="text-xl text-gray-500 line-through">
              {formatCurrency(product.compare_at_price)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div>
          {inStock ? (
            <span className="text-green-600 font-medium">
              In Stock ({product.stock_quantity} available)
            </span>
          ) : (
            <span className="text-red-600 font-medium">Out of Stock</span>
          )}
        </div>

        {/* Quantity Selector */}
        {inStock && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="px-4 py-2 hover:bg-gray-100 disabled:opacity-50"
                >
                  -
                </button>
                <span className="px-6 py-2 border-x border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock_quantity}
                  className="px-4 py-2 hover:bg-gray-100 disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              loading={loading}
              className="w-full"
              size="lg"
            >
              Add to Cart
            </Button>
          </div>
        )}

        {/* Description */}
        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Description</h2>
          <div
            className="prose prose-sm max-w-none text-gray-600"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>

        {/* Additional Info */}
        {(product.sku || product.weight || product.dimensions) && (
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Product Details</h2>
            <dl className="space-y-2">
              {product.sku && (
                <div className="flex">
                  <dt className="text-gray-600 w-32">SKU:</dt>
                  <dd className="text-gray-900">{product.sku}</dd>
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
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
