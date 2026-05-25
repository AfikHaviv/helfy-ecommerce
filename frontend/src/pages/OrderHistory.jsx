import React from 'react';
import { motion } from 'framer-motion';

const OrderHistory = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Order History</h1>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-700">Order history page - To be implemented</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderHistory;
