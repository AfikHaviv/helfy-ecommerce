import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Button from '../common/Button';
import Input from '../common/Input';
import ErrorMessage from '../common/ErrorMessage';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    const { confirmPassword, ...signupData } = formData;
    const result = await signup(signupData);

    if (result.success) {
      navigate('/products');
    } else {
      setError(result.message || 'Failed to create account');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <ErrorMessage message={error} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="First Name"
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          required
          autoComplete="given-name"
        />

        <Input
          label="Last Name"
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          required
          autoComplete="family-name"
        />
      </div>

      <Input
        label="Email Address"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        autoComplete="email"
      />

      <Input
        label="Phone Number"
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        autoComplete="tel"
      />

      <Input
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
        autoComplete="new-password"
        minLength={8}
      />

      <Input
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
        autoComplete="new-password"
        minLength={8}
      />

      <div className="flex items-center">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          required
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
          I agree to the{' '}
          <Link to="/terms" className="text-indigo-600 hover:text-indigo-500">
            Terms and Conditions
          </Link>
        </label>
      </div>

      <Button type="submit" loading={loading} className="w-full">
        Create Account
      </Button>

      <div className="text-center text-sm">
        <span className="text-gray-600">Already have an account? </span>
        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
          Sign in
        </Link>
      </div>
    </form>
  );
};

export default SignupForm;
