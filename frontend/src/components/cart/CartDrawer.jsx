import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import CartItem from './CartItem';
import { formatCurrency } from '../../utils/formatters';

const CartDrawer = ({ isOpen, onClose, cart, onUpdateQuantity, onRemoveItem }) => {
  const total = cart?.items?.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  ) || 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                Shopping Cart
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {!cart?.items || cart.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-gray-500 mb-4">Your cart is empty</p>
                  <Button onClick={onClose} variant="outline">
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={onUpdateQuantity}
                      onRemove={onRemoveItem}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart?.items && cart.items.length > 0 && (
              <div className="border-t p-6 space-y-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <Link to="/cart" onClick={onClose}>
                  <Button variant="outline" className="w-full mb-2">
                    View Cart
                  </Button>
                </Link>
                <Link to="/checkout" onClick={onClose}>
                  <Button className="w-full">Proceed to Checkout</Button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
