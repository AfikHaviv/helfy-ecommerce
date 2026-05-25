# Helfy eCommerce Platform - AI Bootstrap Document

## Document Purpose
Single source of truth for building a production-grade eCommerce platform. Follow exactly as written. No deviations, assumptions, or shortcuts.

---

## Technology Stack

- **Frontend**: React.js 18.x + React Router v6
- **Backend**: Node.js 18.x+ + Express.js 4.x
- **Database**: MySQL 8.0+
- **Styling**: Tailwind CSS 3.x + Framer Motion
- **Authentication**: JWT with httpOnly cookies
- **State Management**: React Context API + useReducer
- **HTTP Client**: Axios
- **Validation**: Joi (backend), HTML5 constraint validation (frontend)
- **Password Hashing**: bcrypt
- **Database Access**: mysql2 with raw SQL queries (no ORM)

---

## Architectural Decisions

### Decision 1: Monorepo Structure
**Choice**: Single repository with `/frontend` and `/backend` directories  
**Rationale**: Simplifies development and deployment coordination while maintaining separation of concerns

### Decision 2: JWT Storage
**Choice**: httpOnly cookies instead of localStorage  
**Rationale**: Prevents XSS attacks - tokens cannot be accessed by JavaScript

### Decision 3: State Management
**Choice**: Context API with useReducer instead of Redux  
**Rationale**: Sufficient complexity, less boilerplate, easier maintenance

### Decision 4: Database Access
**Choice**: Raw SQL with mysql2 instead of ORM  
**Rationale**: Better performance control, explicit optimization, easier debugging

### Decision 5: API Architecture
**Choice**: RESTful with resource-based routing  
**Rationale**: Industry standard, predictable, excellent tooling

### Decision 6: Error Handling
**Choice**: Centralized middleware with custom error classes  
**Rationale**: Consistent responses, easier debugging, cleaner controllers

### Decision 7: Frontend Validation
**Choice**: HTML5 constraint validation with controlled inputs  
**Rationale**: Native browser support, no additional dependencies, progressive enhancement

---

## Folder Structure

### Backend (`/backend`)
```
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── jwt.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── product.routes.js
│   │   ├── category.routes.js
│   │   ├── cart.routes.js
│   │   ├── order.routes.js
│   │   └── index.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── product.controller.js
│   │   ├── category.controller.js
│   │   ├── cart.controller.js
│   │   └── order.controller.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── product.model.js
│   │   ├── category.model.js
│   │   ├── cart.model.js
│   │   └── order.model.js
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── user.validator.js
│   │   ├── product.validator.js
│   │   ├── cart.validator.js
│   │   └── order.validator.js
│   ├── utils/
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   ├── asyncHandler.js
│   │   └── helpers.js
│   ├── scripts/
│   │   ├── createDatabase.js
│   │   ├── createTables.js
│   │   └── seedData.js
│   └── server.js
├── .env.example
├── .env
├── .gitignore
├── package.json
└── README.md
```

### Frontend (`/frontend`)
```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── api/
│   │   ├── axios.js
│   │   ├── auth.api.js
│   │   ├── user.api.js
│   │   ├── product.api.js
│   │   ├── category.api.js
│   │   ├── cart.api.js
│   │   └── order.api.js
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── ErrorMessage.jsx
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── SignupForm.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── product/
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductGrid.jsx
│   │   │   ├── ProductFilter.jsx
│   │   │   ├── ProductSearch.jsx
│   │   │   └── ProductDetails.jsx
│   │   ├── cart/
│   │   │   ├── CartItem.jsx
│   │   │   ├── CartSummary.jsx
│   │   │   └── CartDrawer.jsx
│   │   ├── checkout/
│   │   │   ├── CheckoutSteps.jsx
│   │   │   ├── ShippingForm.jsx
│   │   │   ├── PaymentForm.jsx
│   │   │   └── OrderSummary.jsx
│   │   └── account/
│   │       ├── OrderCard.jsx
│   │       ├── ProfileForm.jsx
│   │       └── AddressCard.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   └── ThemeContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useCart.js
│   │   ├── useProducts.js
│   │   └── useDebounce.js
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Products.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── OrderConfirmation.jsx
│   │   ├── Account.jsx
│   │   ├── OrderHistory.jsx
│   │   ├── Profile.jsx
│   │   └── NotFound.jsx
│   ├── utils/
│   │   ├── formatters.js
│   │   └── constants.js
│   ├── styles/
│   │   └── index.css
│   ├── App.jsx
│   ├── index.jsx
│   └── routes.js
├── .env.example
├── .env
├── .gitignore
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## Naming Conventions

### Files
- Utilities: camelCase (`auth.controller.js`)
- React Components: PascalCase (`ProductCard.jsx`)
- Directories: lowercase (`middleware/`, `api/`)

### Code
- Variables: camelCase (`userId`)
- Constants: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- Functions: camelCase with verb prefix (`getUserById`, `createOrder`)
- React Components: PascalCase (`ProductCard`)
- Database Tables: snake_case (`users`, `order_items`)
- Database Columns: snake_case (`user_id`, `created_at`)
- API Routes: lowercase with hyphens, plural (`/api/products`, `/api/order-items`)
- Environment Variables: UPPER_SNAKE_CASE (`DB_HOST`, `JWT_SECRET`)

### Code Style
- Use `const` and `let`, never `var`
- Use `===` and `!==`, never `==` or `!=`
- Use async/await, never raw promises
- Use destructuring for object properties
- Use explicit return statements
- Functional components with hooks only, never class components
- Use early returns for conditional rendering

---

## Database Schema

```sql
CREATE DATABASE IF NOT EXISTS helfy_ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE helfy_ecommerce;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  role ENUM('customer', 'admin') DEFAULT 'customer',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB;

CREATE TABLE user_addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  address_type ENUM('shipping', 'billing', 'both') DEFAULT 'shipping',
  is_default BOOLEAN DEFAULT FALSE,
  full_name VARCHAR(200) NOT NULL,
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL DEFAULT 'United States',
  phone VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB;

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  parent_id INT NULL,
  image_url VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_slug (slug),
  INDEX idx_parent_id (parent_id)
) ENGINE=InnoDB;

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  short_description VARCHAR(500),
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  sku VARCHAR(100) UNIQUE,
  barcode VARCHAR(100),
  stock_quantity INT NOT NULL DEFAULT 0,
  low_stock_threshold INT DEFAULT 10,
  weight DECIMAL(8,2),
  dimensions VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  rating_average DECIMAL(3,2) DEFAULT 0.00,
  rating_count INT DEFAULT 0,
  view_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_sku (sku),
  INDEX idx_is_active (is_active),
  INDEX idx_price (price)
) ENGINE=InnoDB;

CREATE TABLE product_categories (
  product_id INT NOT NULL,
  category_id INT NOT NULL,
  PRIMARY KEY (product_id, category_id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE product_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  alt_text VARCHAR(255),
  is_primary BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_product_id (product_id)
) ENGINE=InnoDB;

CREATE TABLE carts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  session_id VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_session_id (session_id),
  UNIQUE KEY unique_user_cart (user_id),
  UNIQUE KEY unique_session_cart (session_id)
) ENGINE=InnoDB;

CREATE TABLE cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cart_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  price_at_addition DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY unique_cart_product (cart_id, product_id)
) ENGINE=InnoDB;

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  order_number VARCHAR(50) NOT NULL UNIQUE,
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded') DEFAULT 'pending',
  payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  payment_method VARCHAR(50),
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0.00,
  shipping_amount DECIMAL(10,2) DEFAULT 0.00,
  discount_amount DECIMAL(10,2) DEFAULT 0.00,
  total_amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  notes TEXT,
  shipped_at TIMESTAMP NULL,
  delivered_at TIMESTAMP NULL,
  cancelled_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_order_number (order_number),
  INDEX idx_status (status)
) ENGINE=InnoDB;

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_sku VARCHAR(100),
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_order_id (order_id)
) ENGINE=InnoDB;

CREATE TABLE order_shipping_addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL UNIQUE,
  full_name VARCHAR(200) NOT NULL,
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE product_reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  order_id INT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_product_id (product_id)
) ENGINE=InnoDB;
```

---

## Backend API Routes

### Response Structure
```javascript
// Success
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}

// Error
{
  "success": false,
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE",
    "details": { ... }
  }
}

// Paginated
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Route Definitions

**Authentication (`/api/auth`)**
```
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/logout              (auth required)
GET    /api/auth/me                  (auth required)
POST   /api/auth/refresh-token
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
```

**Users (`/api/users`)**
```
GET    /api/users/profile            (auth required)
PUT    /api/users/profile            (auth required)
PATCH  /api/users/password           (auth required)
GET    /api/users/addresses          (auth required)
POST   /api/users/addresses          (auth required)
PUT    /api/users/addresses/:id      (auth required)
DELETE /api/users/addresses/:id      (auth required)
PATCH  /api/users/addresses/:id/default (auth required)
```

**Products (`/api/products`)**
```
GET    /api/products                 (query: page, limit, search, category, minPrice, maxPrice, sort, inStock, featured)
GET    /api/products/featured
GET    /api/products/:id
GET    /api/products/slug/:slug
POST   /api/products                 (auth required, admin only)
PUT    /api/products/:id             (auth required, admin only)
DELETE /api/products/:id             (auth required, admin only)
```

**Categories (`/api/categories`)**
```
GET    /api/categories
GET    /api/categories/:id
GET    /api/categories/:id/products
POST   /api/categories               (auth required, admin only)
PUT    /api/categories/:id           (auth required, admin only)
DELETE /api/categories/:id           (auth required, admin only)
```

**Cart (`/api/cart`)**
```
GET    /api/cart                     (auth or session required)
POST   /api/cart/items               (auth or session required)
PUT    /api/cart/items/:id           (auth or session required)
DELETE /api/cart/items/:id           (auth or session required)
DELETE /api/cart                     (auth or session required)
POST   /api/cart/merge               (auth required)
```

**Orders (`/api/orders`)**
```
GET    /api/orders                   (auth required)
GET    /api/orders/:id               (auth required)
POST   /api/orders                   (auth required)
PATCH  /api/orders/:id/cancel        (auth required)
GET    /api/orders/:id/invoice       (auth required)
```

**Admin Orders (`/api/admin/orders`)**
```
GET    /api/admin/orders             (auth required, admin only)
PATCH  /api/admin/orders/:id/status  (auth required, admin only)
```

---

## Frontend Routes

```javascript
// Public
/                          - Home.jsx
/login                     - Login.jsx
/signup                    - Signup.jsx
/products                  - Products.jsx
/products/:slug            - ProductDetail.jsx
/cart                      - Cart.jsx

// Protected
/checkout                  - Checkout.jsx
/order-confirmation/:orderId - OrderConfirmation.jsx
/account                   - Account.jsx
/account/orders            - OrderHistory.jsx
/account/orders/:id        - OrderDetail.jsx
/account/profile           - Profile.jsx

// Error
*                          - NotFound.jsx
```

---

## Phased Execution Plan

### Phase 1: Database Setup

1. Create database connection pool in `backend/src/config/database.js`
2. Create script `backend/src/scripts/createDatabase.js` to create database
3. Create script `backend/src/scripts/createTables.js` to execute all CREATE TABLE statements
4. Create script `backend/src/scripts/seedData.js` with: 2 admins, 10 customers, 15 categories, 50 products, 150+ images, 5 addresses, 3 carts, 10 orders
5. Execute all scripts in order and verify data

**Success Criteria:**
- Database `helfy_ecommerce` exists with all 13 tables
- Query `SELECT COUNT(*) FROM products` returns 50
- Query `SELECT COUNT(*) FROM orders` returns 10

---

### Phase 2: Backend Development

1. Set up Express server with all middleware (cors, cookie-parser, express.json, error handler) in `backend/src/server.js`
2. Create all utility classes (ApiError, ApiResponse, asyncHandler), middleware (auth, validation), and validators
3. Create all models with raw SQL queries for database operations
4. Create all controllers implementing business logic for auth, users, products, categories, cart, orders
5. Create all route files, wire controllers, apply middleware, aggregate in `routes/index.js`, mount in server

**Success Criteria:**
- Server starts on configured port without errors
- POST /api/auth/signup creates user and returns JWT cookie
- GET /api/products returns paginated products with filters working

---

### Phase 3: Frontend Development

1. Set up React app with Tailwind CSS, configure axios instance with interceptors, create all API service files
2. Create all context providers (AuthContext, CartContext) with state management and API integration
3. Create all common components (Header, Footer, Button, Input, Modal, Loader, ErrorMessage) with Tailwind styling
4. Create all feature-specific components (auth, product, cart, checkout, account) with Framer Motion animations
5. Create all pages, set up routing in App.jsx with ProtectedRoute, test complete user flow end-to-end

**Success Criteria:**
- Complete flow works: signup → browse products → add to cart → checkout → view order history
- Cart persists across page refreshes for authenticated users
- UI is responsive on mobile, tablet, and desktop with no console errors

---

## Critical Prohibitions

1. **NEVER use class components** - Only functional components with hooks
2. **NEVER use inline styles** - Only Tailwind CSS classes
3. **NEVER skip error handling** - Every async operation must have try-catch
4. **NEVER skip input validation** - Validate on both frontend and backend
5. **NEVER use SQL string concatenation** - Always use parameterized queries
6. **NEVER store passwords in plain text** - Always hash with bcrypt
7. **NEVER hardcode sensitive data** - Always use environment variables
8. **NEVER use `==` for comparison** - Always use `===` and `!==`
9. **NEVER use `index` as key in lists** - Use unique identifiers
10. **NEVER commit `.env` files** - Always gitignore, provide `.env.example`

---

## Environment Variables

**Backend `.env`**
```
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=helfy_ecommerce
DB_PORT=3306
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
CORS_ORIGIN=http://localhost:3000
```

**Frontend `.env`**
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

**Document Version**: 2.0  
**Status**: Ready for Implementation
