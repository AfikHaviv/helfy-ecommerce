import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { orderAPI } from '../api/order.api';
import { formatCurrency, formatDate } from '../utils/formatters';
import { ORDER_STATUS_COLORS } from '../utils/constants';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import Button from '../components/common/Button';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getOrderById(id);
      if (response.success && response.data?.order) {
        setOrder(response.data.order);
      } else {
        setError('Order not found.');
      }
    } catch (err) {
      setError(err.message || 'Failed to load order.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    setCancelling(true);
    setCancelError('');
    try {
      const response = await orderAPI.cancelOrder(id);
      if (response.success) {
        setOrder({ ...order, status: 'cancelled' });
      } else {
        setCancelError('Failed to cancel order.');
      }
    } catch (err) {
      setCancelError(err.message || 'Failed to cancel order.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ErrorMessage message={error} />
          <Button onClick={() => navigate('/account/orders')} className="mt-4">
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  const canCancel = order.status === 'pending' || order.status === 'processing';
  const statusClass = ORDER_STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <button
                onClick={() => navigate('/account/orders')}
                className="text-primary-600 hover:text-primary-700 text-sm mb-2 flex items-center"
              >
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Orders
              </button>
              <h1 className="text-3xl font-bold text-gray-900">
                Order #{order.order_number}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Placed on {formatDate(order.created_at)}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusClass}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>

          {cancelError && (
            <div className="mb-4">
              <ErrorMessage message={cancelError} onClose={() => setCancelError('')} />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
                <div className="space-y-4">
                  {(order.items || []).map((item) => {
                    const primaryImage = item.product?.images?.find(img => img.is_primary)?.image_url ||
                      item.product?.images?.[0]?.image_url ||
                      'https://via.placeholder.com/80x80?text=No+Image';
                    return (
                      <div key={item.id} className="flex items-center space-x-4 border-b pb-4 last:border-b-0 last:pb-0">
                        <img
                          src={primaryImage}
                          alt={item.product?.name}
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">
                            {item.product?.name || item.product_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity} &times; {formatCurrency(item.unit_price)}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(item.unit_price * item.quantity)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Shipping Address */}
              {order.shipping_address && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p className="font-medium">{order.shipping_address.full_name}</p>
                    <p>{order.shipping_address.address_line1}</p>
                    {order.shipping_address.address_line2 && (
                      <p>{order.shipping_address.address_line2}</p>
                    )}
                    <p>
                      {order.shipping_address.city}, {order.shipping_address.state}{' '}
                      {order.shipping_address.postal_code}
                    </p>
                    <p>{order.shipping_address.country}</p>
                    {order.shipping_address.phone && (
                      <p className="mt-2">{order.shipping_address.phone}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>{formatCurrency(order.subtotal || 0)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span>
                      {order.shipping_amount === 0 ? 'FREE' : formatCurrency(order.shipping_amount || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax</span>
                    <span>{formatCurrency(order.tax_amount || 0)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold text-gray-900 text-base">
                    <span>Total</span>
                    <span>{formatCurrency(order.total_amount)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment</h2>
                <p className="text-sm text-gray-700 capitalize">
                  {(order.payment_method || '').replace(/_/g, ' ')}
                </p>
                <p className="text-sm text-gray-500 mt-1 capitalize">
                  Status: {order.payment_status || 'pending'}
                </p>
              </div>

              {canCancel && (
                <Button
                  onClick={handleCancelOrder}
                  variant="danger"
                  loading={cancelling}
                  className="w-full"
                >
                  Cancel Order
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderDetail;
