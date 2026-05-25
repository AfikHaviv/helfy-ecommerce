import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatCurrency } from '../../utils/formatters';
import Button from '../common/Button';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const [updating, setUpdating] = React.useState(false);
  const [removing, setRemoving] = React.useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    setUpdating(true);
    await onUpdateQuantity(item.id, newQuantity);
    setUpdating(false);
  };

  const handleRemove = async () => {
    setRemoving(true);
    await onRemove(item.id);
  };

  const primaryImage = item.product?.images?.find(img => img.is_primary)?.image_url ||
                       item.product?.images?.[0]?.image_url ||
                       'https://via.placeholder.com/150x150?text=No+Image';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4"
    >
      {/* Product Image */}
      <Link to={`/products/${item.product?.slug}`} className="flex-shrink-0">
        <img
          src={primaryImage}
          alt={item.product?.name}
          className="w-24 h-24 object-cover rounded-lg"
        />
      </Link>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <Link
          to={`/products/${item.product?.slug}`}
          className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors block truncate"
        >
          {item.product?.name}
        </Link>
        <p className="text-sm text-gray-600 mt-1">
          Price: {formatCurrency(item.price_at_addition)}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={updating || item.quantity <= 1}
          className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          -
        </button>
        <span className="text-lg font-semibold w-12 text-center">
          {item.quantity}
        </span>
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={updating || item.quantity >= (item.product?.stock_quantity || 999)}
          className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          +
        </button>
      </div>

      {/* Subtotal */}
      <div className="text-right min-w-[100px]">
        <p className="text-lg font-bold text-gray-900">
          {formatCurrency(item.price_at_addition * item.quantity)}
        </p>
      </div>

      {/* Remove Button */}
      <Button
        onClick={handleRemove}
        variant="danger"
        size="sm"
        loading={removing}
        className="flex-shrink-0"
      >
        Remove
      </Button>
    </motion.div>
  );
};

export default CartItem;
