import React from 'react';
import { formatCurrency } from '../../utils/formatters';

const OrderSummary = ({ items, shippingInfo, paymentMethod }) => {
  const subtotal = items.reduce((total, item) => {
    return total + (item.price_at_addition * item.quantity);
  }, 0);

  const tax = subtotal * 0.1;
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + tax + shipping;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

      {/* Items */}
      <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <div className="flex-1">
              <p className="text-gray-900 font-medium">{item.product?.name}</p>
              <p className="text-gray-600">Qty: {item.quantity}</p>
            </div>
            <p className="text-gray-900 font-medium">
              {formatCurrency(item.price_at_addition * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-gray-700">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Tax (10%)</span>
          <span>{formatCurrency(tax)}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Shipping</span>
          <span>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
        </div>
        <div className="border-t pt-2 flex justify-between text-lg font-bold text-gray-900">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Shipping Info */}
      {shippingInfo && shippingInfo.full_name && (
        <div className="border-t mt-4 pt-4">
          <h4 className="font-semibold text-gray-900 mb-2">Shipping To:</h4>
          <p className="text-sm text-gray-700">
            {shippingInfo.full_name}<br />
            {shippingInfo.address_line1}<br />
            {shippingInfo.address_line2 && <>{shippingInfo.address_line2}<br /></>}
            {shippingInfo.city}, {shippingInfo.state} {shippingInfo.postal_code}<br />
            {shippingInfo.country}<br />
            {shippingInfo.phone}
          </p>
        </div>
      )}

      {/* Payment Method */}
      {paymentMethod && (
        <div className="border-t mt-4 pt-4">
          <h4 className="font-semibold text-gray-900 mb-2">Payment Method:</h4>
          <p className="text-sm text-gray-700 capitalize">
            {paymentMethod.replace('_', ' ')}
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
