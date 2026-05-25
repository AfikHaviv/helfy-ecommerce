import React from 'react';
import { motion } from 'framer-motion';
import Button from '../common/Button';

const AddressCard = ({ address, onEdit, onDelete, onSetDefault }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-white rounded-lg shadow-md p-6 relative ${
        address.is_default ? 'ring-2 ring-indigo-500' : ''
      }`}
    >
      {address.is_default && (
        <span className="absolute top-4 right-4 bg-indigo-500 text-white text-xs px-2 py-1 rounded-full">
          Default
        </span>
      )}

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {address.full_name}
        </h3>
        <p className="text-sm text-gray-600">{address.address_line1}</p>
        {address.address_line2 && (
          <p className="text-sm text-gray-600">{address.address_line2}</p>
        )}
        <p className="text-sm text-gray-600">
          {address.city}, {address.state} {address.postal_code}
        </p>
        <p className="text-sm text-gray-600">{address.country}</p>
        <p className="text-sm text-gray-600 mt-2">{address.phone}</p>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(address)}
          className="flex-1"
        >
          Edit
        </Button>
        {!address.is_default && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSetDefault(address.id)}
            className="flex-1"
          >
            Set Default
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(address.id)}
          className="text-red-600 hover:bg-red-50"
        >
          Delete
        </Button>
      </div>
    </motion.div>
  );
};

export default AddressCard;
