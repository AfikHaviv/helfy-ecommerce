import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useCart from '../hooks/useCart';
import useAuth from '../hooks/useAuth';
import CheckoutSteps from '../components/checkout/CheckoutSteps';
import ShippingForm from '../components/checkout/ShippingForm';
import PaymentForm from '../components/checkout/PaymentForm';
import OrderSummary from '../components/checkout/OrderSummary';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import { orderAPI } from '../api/order.api';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, loading: cartLoading, clearCart } = useCart();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [shippingData, setShippingData] = useState({
    full_name: user ? `${user.first_name} ${user.last_name}` : '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'United States',
    phone: user?.phone || '',
  });

  const [paymentData, setPaymentData] = useState({
    payment_method: '',
    card_number: '',
    expiry_date: '',
    cvv: '',
    cardholder_name: '',
  });

  if (cartLoading) {
    return <Loader fullScreen />;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <Button onClick={() => navigate('/products')} variant="primary">
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');

    try {
      const subtotal = items.reduce((total, item) => {
        return total + (item.price_at_addition * item.quantity);
      }, 0);

      const tax = subtotal * 0.1;
      const shipping = subtotal > 100 ? 0 : 10;
      const total = subtotal + tax + shipping;

      const orderData = {
        payment_method: paymentData.payment_method,
        shipping_address: shippingData,
        subtotal: subtotal,
        tax_amount: tax,
        shipping_amount: shipping,
        total_amount: total,
      };

      const response = await orderAPI.createOrder(orderData);

      if (response.success && response.data) {
        await clearCart();
        navigate(`/order-confirmation/${response.data.order.id}`);
      } else {
        setError('Failed to place order. Please try again.');
      }
    } catch (err) {
      const details = err.data?.error?.details;
      if (details && details.length > 0) {
        setError(details.map(d => d.message).join(' • '));
      } else {
        setError(err.message || 'Failed to place order. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentStep === 3) {
      handlePlaceOrder();
    } else {
      handleNext();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Checkout</h1>

          <CheckoutSteps currentStep={currentStep} />

          {error && (
            <div className="mb-6">
              <ErrorMessage message={error} onClose={() => setError('')} />
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Forms */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-6">
                  {currentStep === 1 && (
                    <ShippingForm
                      formData={shippingData}
                      onChange={setShippingData}
                    />
                  )}

                  {currentStep === 2 && (
                    <PaymentForm
                      formData={paymentData}
                      onChange={setPaymentData}
                    />
                  )}

                  {currentStep === 3 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Review Your Order
                      </h3>
                      <p className="text-gray-700 mb-4">
                        Please review your order details before placing your order.
                      </p>

                      <div className="space-y-4">
                        <div className="border-t pt-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Shipping Address</h4>
                          <p className="text-sm text-gray-700">
                            {shippingData.full_name}<br />
                            {shippingData.address_line1}<br />
                            {shippingData.address_line2 && <>{shippingData.address_line2}<br /></>}
                            {shippingData.city}, {shippingData.state} {shippingData.postal_code}<br />
                            {shippingData.country}<br />
                            {shippingData.phone}
                          </p>
                        </div>

                        <div className="border-t pt-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Payment Method</h4>
                          <p className="text-sm text-gray-700 capitalize">
                            {paymentData.payment_method.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-8">
                    {currentStep > 1 ? (
                      <Button
                        type="button"
                        onClick={handleBack}
                        variant="outline"
                        size="lg"
                      >
                        Back
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={() => navigate('/cart')}
                        variant="outline"
                        size="lg"
                      >
                        Back to Cart
                      </Button>
                    )}

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      loading={loading}
                    >
                      {currentStep === 3 ? 'Place Order' : 'Continue'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <OrderSummary
                  items={items}
                  shippingInfo={currentStep >= 2 ? shippingData : null}
                  paymentMethod={currentStep >= 3 ? paymentData.payment_method : null}
                />
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;
