const Joi = require('joi');

const updateProfileSchema = Joi.object({
  first_name: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'First name must be at least 2 characters long',
      'string.max': 'First name cannot exceed 100 characters'
    }),
  last_name: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Last name must be at least 2 characters long',
      'string.max': 'Last name cannot exceed 100 characters'
    }),
  phone: Joi.string()
    .pattern(/^[0-9+\-\s()]+$/)
    .min(10)
    .max(20)
    .optional()
    .allow('', null)
    .messages({
      'string.pattern.base': 'Please provide a valid phone number'
    })
});

const changePasswordSchema = Joi.object({
  current_password: Joi.string()
    .required()
    .messages({
      'any.required': 'Current password is required'
    }),
  new_password: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.min': 'New password must be at least 8 characters long',
      'any.required': 'New password is required'
    })
});

const addressSchema = Joi.object({
  address_type: Joi.string()
    .valid('shipping', 'billing', 'both')
    .default('shipping')
    .messages({
      'any.only': 'Address type must be shipping, billing, or both'
    }),
  is_default: Joi.boolean()
    .default(false),
  full_name: Joi.string()
    .min(2)
    .max(200)
    .required()
    .messages({
      'string.min': 'Full name must be at least 2 characters long',
      'string.max': 'Full name cannot exceed 200 characters',
      'any.required': 'Full name is required'
    }),
  address_line1: Joi.string()
    .min(5)
    .max(255)
    .required()
    .messages({
      'string.min': 'Address line 1 must be at least 5 characters long',
      'string.max': 'Address line 1 cannot exceed 255 characters',
      'any.required': 'Address line 1 is required'
    }),
  address_line2: Joi.string()
    .max(255)
    .optional()
    .allow('', null)
    .messages({
      'string.max': 'Address line 2 cannot exceed 255 characters'
    }),
  city: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'City must be at least 2 characters long',
      'string.max': 'City cannot exceed 100 characters',
      'any.required': 'City is required'
    }),
  state: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'State must be at least 2 characters long',
      'string.max': 'State cannot exceed 100 characters',
      'any.required': 'State is required'
    }),
  postal_code: Joi.string()
    .min(3)
    .max(20)
    .required()
    .messages({
      'string.min': 'Postal code must be at least 3 characters long',
      'string.max': 'Postal code cannot exceed 20 characters',
      'any.required': 'Postal code is required'
    }),
  country: Joi.string()
    .min(2)
    .max(100)
    .default('Israel')
    .messages({
      'string.min': 'Country must be at least 2 characters long',
      'string.max': 'Country cannot exceed 100 characters'
    }),
  phone: Joi.string()
    .pattern(/^[0-9+\-\s()]+$/)
    .min(10)
    .max(20)
    .required()
    .messages({
      'string.pattern.base': 'Please provide a valid phone number',
      'any.required': 'Phone is required'
    })
});

const idParamSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'ID must be a number',
      'number.integer': 'ID must be an integer',
      'number.positive': 'ID must be positive',
      'any.required': 'ID is required'
    })
});

module.exports = {
  updateProfileSchema,
  changePasswordSchema,
  addressSchema,
  idParamSchema
};
