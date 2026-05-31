const Joi = require('joi');

const createOrderSchema = Joi.object({
  shipping_address: Joi.object({
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
      .required()
      .messages({
        'string.min': 'Country must be at least 2 characters long',
        'string.max': 'Country cannot exceed 100 characters',
        'any.required': 'Country is required'
      }),
    phone: Joi.string()
      .pattern(/^[0-9+\-\s()]+$/)
      .min(7)
      .max(20)
      .required()
      .messages({
        'string.pattern.base': 'Please provide a valid phone number',
        'string.min': 'Phone number must be at least 7 characters long',
        'any.required': 'Phone is required'
      })
  }).required(),
  payment_method: Joi.string()
    .valid('credit_card', 'debit_card', 'paypal', 'cash_on_delivery')
    .required()
    .messages({
      'any.only': 'Invalid payment method',
      'any.required': 'Payment method is required'
    }),
  notes: Joi.string()
    .max(1000)
    .optional()
    .allow('', null)
    .messages({
      'string.max': 'Notes cannot exceed 1000 characters'
    })
});

const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')
    .required()
    .messages({
      'any.only': 'Invalid order status',
      'any.required': 'Status is required'
    })
});

const orderQuerySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.min': 'Page must be at least 1'
    }),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20)
    .messages({
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 100'
    }),
  status: Joi.string()
    .valid('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')
    .optional()
    .messages({
      'any.only': 'Invalid order status'
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
  createOrder: createOrderSchema,
  updateOrderStatus: updateOrderStatusSchema,
  orderQuery: orderQuerySchema,
  idParam: idParamSchema
};
