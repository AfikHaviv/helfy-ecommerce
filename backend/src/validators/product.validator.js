const Joi = require('joi');

const createProductSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(255)
    .required()
    .messages({
      'string.min': 'Product name must be at least 3 characters long',
      'string.max': 'Product name cannot exceed 255 characters',
      'any.required': 'Product name is required'
    }),
  slug: Joi.string()
    .max(255)
    .optional()
    .allow('', null)
    .messages({
      'string.max': 'Slug cannot exceed 255 characters'
    }),
  description: Joi.string()
    .min(10)
    .required()
    .messages({
      'string.min': 'Description must be at least 10 characters long',
      'any.required': 'Description is required'
    }),
  short_description: Joi.string()
    .max(500)
    .optional()
    .allow('', null)
    .messages({
      'string.max': 'Short description cannot exceed 500 characters'
    }),
  price: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      'number.positive': 'Price must be positive',
      'any.required': 'Price is required'
    }),
  compare_at_price: Joi.number()
    .positive()
    .precision(2)
    .optional()
    .allow(null)
    .messages({
      'number.positive': 'Compare at price must be positive'
    }),
  cost_price: Joi.number()
    .positive()
    .precision(2)
    .optional()
    .allow(null)
    .messages({
      'number.positive': 'Cost price must be positive'
    }),
  sku: Joi.string()
    .max(100)
    .optional()
    .allow('', null)
    .messages({
      'string.max': 'SKU cannot exceed 100 characters'
    }),
  barcode: Joi.string()
    .max(100)
    .optional()
    .allow('', null)
    .messages({
      'string.max': 'Barcode cannot exceed 100 characters'
    }),
  stock_quantity: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .messages({
      'number.min': 'Stock quantity cannot be negative'
    }),
  low_stock_threshold: Joi.number()
    .integer()
    .min(0)
    .default(10)
    .messages({
      'number.min': 'Low stock threshold cannot be negative'
    }),
  weight: Joi.number()
    .positive()
    .precision(2)
    .optional()
    .allow(null)
    .messages({
      'number.positive': 'Weight must be positive'
    }),
  dimensions: Joi.string()
    .max(100)
    .optional()
    .allow('', null)
    .messages({
      'string.max': 'Dimensions cannot exceed 100 characters'
    }),
  is_active: Joi.boolean()
    .default(true),
  is_featured: Joi.boolean()
    .default(false),
  category_ids: Joi.array()
    .items(Joi.number().integer().positive())
    .optional()
    .messages({
      'array.base': 'Category IDs must be an array'
    })
});

const updateProductSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(255)
    .optional()
    .messages({
      'string.min': 'Product name must be at least 3 characters long',
      'string.max': 'Product name cannot exceed 255 characters'
    }),
  slug: Joi.string()
    .max(255)
    .optional()
    .allow('', null)
    .messages({
      'string.max': 'Slug cannot exceed 255 characters'
    }),
  description: Joi.string()
    .min(10)
    .optional()
    .messages({
      'string.min': 'Description must be at least 10 characters long'
    }),
  short_description: Joi.string()
    .max(500)
    .optional()
    .allow('', null)
    .messages({
      'string.max': 'Short description cannot exceed 500 characters'
    }),
  price: Joi.number()
    .positive()
    .precision(2)
    .optional()
    .messages({
      'number.positive': 'Price must be positive'
    }),
  compare_at_price: Joi.number()
    .positive()
    .precision(2)
    .optional()
    .allow(null)
    .messages({
      'number.positive': 'Compare at price must be positive'
    }),
  cost_price: Joi.number()
    .positive()
    .precision(2)
    .optional()
    .allow(null)
    .messages({
      'number.positive': 'Cost price must be positive'
    }),
  sku: Joi.string()
    .max(100)
    .optional()
    .allow('', null)
    .messages({
      'string.max': 'SKU cannot exceed 100 characters'
    }),
  barcode: Joi.string()
    .max(100)
    .optional()
    .allow('', null)
    .messages({
      'string.max': 'Barcode cannot exceed 100 characters'
    }),
  stock_quantity: Joi.number()
    .integer()
    .min(0)
    .optional()
    .messages({
      'number.min': 'Stock quantity cannot be negative'
    }),
  low_stock_threshold: Joi.number()
    .integer()
    .min(0)
    .optional()
    .messages({
      'number.min': 'Low stock threshold cannot be negative'
    }),
  weight: Joi.number()
    .positive()
    .precision(2)
    .optional()
    .allow(null)
    .messages({
      'number.positive': 'Weight must be positive'
    }),
  dimensions: Joi.string()
    .max(100)
    .optional()
    .allow('', null)
    .messages({
      'string.max': 'Dimensions cannot exceed 100 characters'
    }),
  is_active: Joi.boolean()
    .optional(),
  is_featured: Joi.boolean()
    .optional(),
  category_ids: Joi.array()
    .items(Joi.number().integer().positive())
    .optional()
    .messages({
      'array.base': 'Category IDs must be an array'
    })
});

const productQuerySchema = Joi.object({
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
  search: Joi.string()
    .optional()
    .allow('')
    .messages({
      'string.base': 'Search must be a string'
    }),
  category: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      'number.positive': 'Category ID must be positive'
    }),
  minPrice: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.min': 'Minimum price cannot be negative'
    }),
  maxPrice: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.min': 'Maximum price cannot be negative'
    }),
  sort: Joi.string()
    .valid('price_asc', 'price_desc', 'name_asc', 'name_desc', 'newest', 'popular')
    .default('newest')
    .messages({
      'any.only': 'Invalid sort option'
    }),
  inStock: Joi.boolean()
    .optional(),
  featured: Joi.boolean()
    .optional()
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

const slugParamSchema = Joi.object({
  slug: Joi.string()
    .required()
    .messages({
      'any.required': 'Slug is required'
    })
});

module.exports = {
  createProduct: createProductSchema,
  updateProduct: updateProductSchema,
  productQuery: productQuerySchema,
  idParam: idParamSchema,
  slugParam: slugParamSchema
};
