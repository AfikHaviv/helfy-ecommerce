import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useAuth from '../hooks/useAuth';
import { userAPI } from '../api/user.api';
import ProfileForm from '../components/account/ProfileForm';
import ErrorMessage from '../components/common/ErrorMessage';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Profile = () => {
  const { user } = useAuth();
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handleProfileSubmit = async (formData) => {
    setProfileLoading(true);
    setProfileError('');
    setProfileSuccess('');
    try {
      const response = await userAPI.updateProfile(formData);
      if (response.success) {
        setProfileSuccess('Profile updated successfully.');
      } else {
        setProfileError('Failed to update profile.');
      }
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setPasswordError('');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordError('New passwords do not match.');
      return;
    }
    if (passwordData.new_password.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      return;
    }

    setPasswordLoading(true);
    try {
      const response = await userAPI.updatePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
      });
      if (response.success) {
        setPasswordSuccess('Password updated successfully.');
        setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
      } else {
        setPasswordError('Failed to update password.');
      }
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

          {/* Profile Info Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
            {profileSuccess && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
                {profileSuccess}
              </div>
            )}
            <ProfileForm
              user={user}
              onSubmit={handleProfileSubmit}
              loading={profileLoading}
              error={profileError}
            />
          </div>

          {/* Change Password Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h2>

            {passwordSuccess && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
                {passwordSuccess}
              </div>
            )}
            {passwordError && (
              <ErrorMessage message={passwordError} onClose={() => setPasswordError('')} />
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4 mt-4">
              <Input
                label="Current Password"
                type="password"
                name="current_password"
                value={passwordData.current_password}
                onChange={handlePasswordChange}
                required
              />
              <Input
                label="New Password"
                type="password"
                name="new_password"
                value={passwordData.new_password}
                onChange={handlePasswordChange}
                required
              />
              <Input
                label="Confirm New Password"
                type="password"
                name="confirm_password"
                value={passwordData.confirm_password}
                onChange={handlePasswordChange}
                required
              />
              <Button
                type="submit"
                variant="primary"
                loading={passwordLoading}
                className="w-full"
              >
                Change Password
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
