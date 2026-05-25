import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import Input from '../common/Input';
import ErrorMessage from '../common/ErrorMessage';

const ProfileForm = ({ user, onSubmit, loading, error }) => {
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {error && <ErrorMessage message={error} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="First Name"
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
        <Input
          label="Last Name"
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
      </div>

      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        disabled
        className="bg-gray-100"
      />

      <Input
        label="Phone"
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
      />

      <Button type="submit" loading={loading} className="w-full">
        Update Profile
      </Button>
    </motion.form>
  );
};

export default ProfileForm;
