import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useCart from '../hooks/useCart';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { items, loading, updateCartItem, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [clearing, setClearing] = React.useState(false);

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      setClearing(true);
      await clearCart();
      setClearing(false);
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            {items.length > 0 && (
              <Button
                onClick={handleClearCart}
                variant="outline"
                size="sm"
                loading={clearing}
              >
                Clear Cart
              </Button>
            )}
          </div>

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <svg
                className="mx-auto h-24 w-24 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-6">
                Add some products to get started!
              </p>
              <Button
                onClick={() => navigate('/products')}
                variant="primary"
                size="lg"
              >
                Browse Products
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence>
                  {items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={updateCartItem}
                      onRemove={removeFromCart}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Cart Summary */}
              <div className="lg:col-span-1">
                <CartSummary items={items} />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Cart;
