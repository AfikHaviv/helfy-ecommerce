# Helfy eCommerce - Backend API

Backend API for the Helfy eCommerce platform built with Node.js, Express, and MySQL.

## Prerequisites

- Node.js 18.x or higher
- MySQL 8.0 or higher
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the database credentials in `.env`

3. Set up the database:
```bash
npm run db:setup
```

This will:
- Create the database
- Create all tables
- Seed initial data

Or run individually:
```bash
npm run db:create   # Create database
npm run db:tables   # Create tables
npm run db:seed     # Seed data
```

## Running the Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Documentation

Base URL: `http://localhost:5000/api`

### Authentication
- POST `/auth/signup` - Register new user
- POST `/auth/login` - Login user
- POST `/auth/logout` - Logout user
- GET `/auth/me` - Get current user

### Products
- GET `/products` - Get all products (with filters)
- GET `/products/:id` - Get product by ID
- GET `/products/slug/:slug` - Get product by slug

### Categories
- GET `/categories` - Get all categories
- GET `/categories/:id` - Get category by ID

### Cart
- GET `/cart` - Get user cart
- POST `/cart/items` - Add item to cart
- PUT `/cart/items/:id` - Update cart item
- DELETE `/cart/items/:id` - Remove cart item

### Orders
- GET `/orders` - Get user orders
- GET `/orders/:id` - Get order by ID
- POST `/orders` - Create new order

## Database Schema

The database includes the following tables:
- users
- user_addresses
- categories
- products
- product_categories
- product_images
- carts
- cart_items
- orders
- order_items
- order_shipping_addresses
- product_reviews

## Test Credentials

### Admin Account
- Email: [EMAIL]
- Password: Password123!

### Customer Account
- Email: [EMAIL]
- Password: Password123!

## Technology Stack

- **Runtime**: Node.js 18.x
- **Framework**: Express.js 4.x
- **Database**: MySQL 8.0
- **Authentication**: JWT with httpOnly cookies
- **Validation**: Joi
- **Password Hashing**: bcrypt
- **Database Driver**: mysql2
