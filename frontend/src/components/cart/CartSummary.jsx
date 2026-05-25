import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatters';
import Button from '../common/Button';

const CartSummary = ({ items }) => {
  const navigate = useNavigate();

  const subtotal = items.reduce((total, item) => {
    return total + (item.price_at_addition * item.quantity);
  }, 0);

  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + tax + shipping;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

      <div className="space-y-3 mb-6">
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

        {subtotal < 100 && subtotal > 0 && (
          <p className="text-sm text-primary-600">
            Add {formatCurrency(100 - subtotal)} more for free shipping!
          </p>
        )}

        <div className="border-t pt-3">
          <div className="flex justify-between text-lg font-bold text-gray-900">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      <Button
        onClick={() => navigate('/checkout')}
        variant="primary"
        size="lg"
        disabled={items.length === 0}
        className="w-full"
      >
        Proceed to Checkout
      </Button>

      <Button
        onClick={() => navigate('/products')}
        variant="outline"
        size="md"
        className="w-full mt-3"
      >
        Continue Shopping
      </Button>
    </div>
  );
};

export default CartSummary;
