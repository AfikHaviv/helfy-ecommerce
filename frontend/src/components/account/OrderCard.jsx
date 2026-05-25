import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../utils/formatters';

const OrderCard = ({ order }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Order #{order.order_number}
          </h3>
          <p className="text-sm text-gray-500">
            {formatDate(order.created_at)}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
            order.status
          )}`}
        >
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Items:</span>
          <span className="font-medium">{order.items?.length || 0}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total:</span>
          <span className="font-semibold text-lg">
            {formatCurrency(order.total_amount)}
          </span>
        </div>
      </div>

      <Link
        to={`/account/orders/${order.id}`}
        className="block w-full text-center bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
      >
        View Details
      </Link>
    </motion.div>
  );
};

export default OrderCard;
