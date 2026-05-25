import React from 'react';
import Input from '../common/Input';
import { PAYMENT_METHODS } from '../../utils/constants';

const PaymentForm = ({ formData, onChange }) => {
  const handleChange = (e) => {
    onChange({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Method <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {PAYMENT_METHODS.map((method) => (
            <label
              key={method.value}
              className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <input
                type="radio"
                name="payment_method"
                value={method.value}
                checked={formData.payment_method === method.value}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                required
              />
              <span className="ml-3 text-gray-900">{method.label}</span>
            </label>
          ))}
        </div>
      </div>

      {formData.payment_method && formData.payment_method !== 'cash_on_delivery' && (
        <>
          <Input
            label="Card Number"
            type="text"
            name="card_number"
            value={formData.card_number || ''}
            onChange={handleChange}
            placeholder="1234 5678 9012 3456"
            required={formData.payment_method !== 'cash_on_delivery'}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Expiry Date"
              type="text"
              name="expiry_date"
              value={formData.expiry_date || ''}
              onChange={handleChange}
              placeholder="MM/YY"
              required={formData.payment_method !== 'cash_on_delivery'}
            />

            <Input
              label="CVV"
              type="text"
              name="cvv"
              value={formData.cvv || ''}
              onChange={handleChange}
              placeholder="123"
              required={formData.payment_method !== 'cash_on_delivery'}
              maxLength={4}
            />
          </div>

          <Input
            label="Cardholder Name"
            type="text"
            name="cardholder_name"
            value={formData.cardholder_name || ''}
            onChange={handleChange}
            placeholder="John Doe"
            required={formData.payment_method !== 'cash_on_delivery'}
          />
        </>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> This is a demo checkout. No real payment will be processed.
        </p>
      </div>
    </div>
  );
};

export default PaymentForm;
