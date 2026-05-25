import React from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="mb-6">
              <svg
                className="mx-auto h-16 w-16 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
            <p className="text-gray-700 mb-2">Thank you for your order.</p>
            <p className="text-gray-600 mb-8">Order ID: #{orderId}</p>
            
            <div className="space-y-3">
              <Button
                onClick={() => navigate('/account/orders')}
                variant="primary"
                size="lg"
                className="w-full"
              >
                View Order History
              </Button>
              <Button
                onClick={() => navigate('/products')}
                variant="outline"
                size="lg"
                className="w-full"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
