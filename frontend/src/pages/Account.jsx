import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuth from '../hooks/useAuth';

const Account = () => {
  const { user } = useAuth();

  const menuItems = [
    {
      title: 'Order History',
      description: 'View and track your past orders',
      href: '/account/orders',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      title: 'Profile Settings',
      description: 'Update your personal information and password',
      href: '/account/profile',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          {user && (
            <p className="text-gray-600 mt-1">
              Welcome back, {user.first_name} {user.last_name}
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={item.href}
                className="block bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 group"
              >
                <div className="flex items-start space-x-4">
                  <div className="text-primary-600 group-hover:text-primary-700 transition-colors flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {item.title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Account;
