import React from 'react';
import Input from '../common/Input';
import { US_STATES } from '../../utils/constants';

const ShippingForm = ({ formData, onChange }) => {
  const handleChange = (e) => {
    onChange({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h3>

      <Input
        label="Full Name"
        type="text"
        name="full_name"
        value={formData.full_name || ''}
        onChange={handleChange}
        placeholder="John Doe"
        required
      />

      <Input
        label="Address Line 1"
        type="text"
        name="address_line1"
        value={formData.address_line1 || ''}
        onChange={handleChange}
        placeholder="123 Main St"
        required
      />

      <Input
        label="Address Line 2"
        type="text"
        name="address_line2"
        value={formData.address_line2 || ''}
        onChange={handleChange}
        placeholder="Apt 4B (optional)"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="City"
          type="text"
          name="city"
          value={formData.city || ''}
          onChange={handleChange}
          placeholder="New York"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <select
            name="state"
            value={formData.state || ''}
            onChange={handleChange}
            required
            className="input-field"
          >
            <option value="">Select State</option>
            {US_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Postal Code"
          type="text"
          name="postal_code"
          value={formData.postal_code || ''}
          onChange={handleChange}
          placeholder="10001"
          required
        />

        <Input
          label="Country"
          type="text"
          name="country"
          value={formData.country || 'United States'}
          onChange={handleChange}
          required
        />
      </div>

      <Input
        label="Phone"
        type="tel"
        name="phone"
        value={formData.phone || ''}
        onChange={handleChange}
        placeholder="+1 (555) 123-4567"
        required
      />
    </div>
  );
};

export default ShippingForm;
