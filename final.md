# Helfy eCommerce — Project Summary

## Overview

Helfy is a full-stack eCommerce web application built with React (frontend), Node.js/Express (backend), and MySQL (database). It supports the complete shopping lifecycle: browsing products, managing a cart (including guest carts), checking out, and tracking orders.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, React Router 7, Tailwind CSS 3, Framer Motion, Axios |
| Backend | Node.js, Express 4, mysql2 (connection pool), JWT, bcrypt, Joi |
| Database | MySQL — 13 tables with foreign keys and 30+ indexes |
| Auth | JWT stored in httpOnly cookies |
| Styling | Tailwind CSS (utility-first), Framer Motion (animations) |

---

## Directory Structure

```
Helfy_eCommerce/
├── backend/
│   ├── src/
│   │   ├── config/         # Database pool and JWT helpers
│   │   ├── controllers/    # Business logic (one per domain)
│   │   ├── middleware/     # Auth, session, validation, error handling
│   │   ├── models/         # Raw SQL query functions
│   │   ├── routes/         # Express route definitions
│   │   ├── scripts/        # DB create / seed scripts
│   │   ├── utils/          # Shared helpers
│   │   ├── validators/     # Joi input schemas
│   │   └── server.js       # Express entry point (port 5000)
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios service modules (one per domain)
│   │   ├── components/     # Reusable UI components (25 total)
│   │   ├── context/        # Auth, Cart, Theme — React Context providers
│   │   ├── hooks/          # Custom hooks (useAuth, useCart, useProducts, useDebounce)
│   │   ├── pages/          # Page-level components (13 total)
│   │   ├── utils/          # Utility functions
│   │   ├── App.jsx         # Root router + context providers
│   │   └── index.js        # DOM entry point
│   ├── tailwind.config.js
│   ├── .env.example
│   └── package.json
├── README.md
├── initial.md              # Original project blueprint/spec
└── final.md                # This file
```

---

## Setup & Running

### Prerequisites
- Node.js 18+
- MySQL 8+

### Backend
```bash
cd backend
npm install
cp .env.example .env        # Fill in DB credentials and JWT secret
npm run db:setup            # Creates DB, tables, and seeds sample data
npm run dev                 # Starts API on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env        # Set REACT_APP_API_URL=http://localhost:5000/api
npm start                   # Starts on http://localhost:3000
```

### Test Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@helfy.com | Password123! |
| Customer | customer1@helfy.com | Customer123! |

---

## Environment Variables

### Backend (`.env`)
```
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=helfy_ecommerce
DB_PORT=3306
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
CORS_ORIGIN=http://localhost:3000
```

### Frontend (`.env`)
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Database Schema

13 tables organized into three groups:

### Users
| Table | Key Columns |
|-------|-------------|
| `users` | id, email, password_hash, name, role (customer/admin), is_active, timestamps |
| `user_addresses` | id, user_id, address_type (shipping/billing), is_default, full address fields |

### Product Catalog
| Table | Key Columns |
|-------|-------------|
| `categories` | id, name, slug, parent_id (hierarchical) |
| `products` | id, name, slug, sku, price, cost, stock, featured, ratings, view_count, 30+ fields |
| `product_categories` | product_id, category_id (many-to-many) |
| `product_images` | id, product_id, url, is_primary, display_order |
| `product_reviews` | id, product_id, user_id, rating, body, verified_purchase, approved |

### Shopping & Orders
| Table | Key Columns |
|-------|-------------|
| `carts` | id, user_id (nullable), session_id (for guests), timestamps |
| `cart_items` | id, cart_id, product_id, quantity, price_at_addition |
| `orders` | id, user_id, status (pending/processing/shipped/delivered/cancelled/refunded), payment_status, totals |
| `order_items` | id, order_id, product snapshot (name, sku, unit_price, quantity) |
| `order_shipping_addresses` | id, order_id, address snapshot at order time |

---

## API Endpoints

### Auth — `/api/auth/`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/signup` | — | Register new user |
| POST | `/login` | — | Login, returns JWT cookie |
| POST | `/logout` | ✓ | Clear JWT cookie |
| GET | `/me` | ✓ | Get current user |
| POST | `/refresh-token` | — | Refresh JWT |
| POST | `/forgot-password` | — | Request password reset |
| POST | `/reset-password` | — | Complete password reset |

### Products — `/api/products/`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | — | List with filtering, sorting, pagination |
| GET | `/featured` | — | Featured products |
| GET | `/:id` | — | Product by ID |
| GET | `/slug/:slug` | — | Product by URL slug |
| POST | `/` | Admin | Create product |
| PUT | `/:id` | Admin | Update product |
| DELETE | `/:id` | Admin | Delete product |

### Categories — `/api/categories/`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | — | All categories |
| GET | `/:id` | — | Category by ID |

### Cart — `/api/cart/`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | Optional | Get cart (user or guest) |
| POST | `/items` | Optional | Add item to cart |
| PUT | `/items/:id` | Optional | Update item quantity |
| DELETE | `/items/:id` | Optional | Remove item |
| DELETE | `/` | Optional | Clear cart |
| POST | `/merge` | ✓ | Merge guest cart after login |

### Orders — `/api/orders/`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | ✓ | User's order history |
| GET | `/:id` | ✓ | Order details |
| POST | `/` | ✓ | Create order from cart |
| PATCH | `/:id/cancel` | ✓ | Cancel a pending order |
| GET | `/:id/invoice` | ✓ | Download invoice |

### Users — `/api/users/`
Profile and address management (authenticated).

### Admin — `/api/admin/`
Dashboard and analytics endpoints (admin role required).

---

## Backend Architecture

### Middleware Stack
- **`auth.js`** — `protect` (require JWT), `authorize(...roles)` (RBAC), `optionalAuth` (attach user if present)
- **`session.js`** — Generates a `session_id` cookie for guest users, enabling cart tracking before login
- **`validation.js`** — Wraps Joi schemas; returns 400 with field errors on invalid input
- **`errorHandler.js`** — Global error handler and 404 catcher

### Pattern
Routes → Controllers (business logic) → Models (raw SQL) → MySQL pool

Authentication uses JWTs in httpOnly cookies; no tokens are exposed to JavaScript. bcrypt handles password hashing. Joi validates all incoming request bodies.

---

## Frontend Architecture

### State Management — React Context
| Context | Provides |
|---------|----------|
| `AuthContext` | `user`, `isAuthenticated`, `loading`, `login()`, `signup()`, `logout()`, `checkAuth()` |
| `CartContext` | `items[]`, `loading`, `addToCart()`, `updateCartItem()`, `removeFromCart()`, `clearCart()`, `getCartTotal()`, `getCartCount()` |
| `ThemeContext` | `theme`, `toggleTheme()` — persisted to localStorage |

`AuthContext` calls `/api/auth/me` on mount to restore session from the existing JWT cookie.

### Routes
| Type | Paths |
|------|-------|
| Public | `/`, `/login`, `/signup`, `/products`, `/products/:slug`, `/cart` |
| Protected | `/checkout`, `/order-confirmation/:orderId`, `/account`, `/account/profile`, `/account/orders`, `/account/orders/:id` |
| Error | `/*` → NotFound |

Protected routes use a `ProtectedRoute` wrapper component that redirects unauthenticated users to `/login`.

### Pages (13)
| Page | Description |
|------|-------------|
| Home | Landing page with hero section and featured products |
| Products | Catalog with category filter, price range, stock filter, search (debounced), sort, and pagination |
| ProductDetail | Image gallery, description, add-to-cart, reviews |
| Cart | Item list with quantity controls, subtotal, free shipping indicator |
| Checkout | 3-step flow: Shipping → Payment → Review & Confirm |
| OrderConfirmation | Success page with order summary |
| Login | Email/password authentication form |
| Signup | Registration form with validation |
| Account | Dashboard navigation hub |
| Profile | User profile editor |
| OrderHistory | List of past orders |
| OrderDetail | Detailed order view |
| NotFound | 404 error page |

### Components (25)
**Common** — `Header`, `Footer`, `Button`, `Input`, `Loader`, `ErrorMessage`, `Modal`

**Auth** — `LoginForm`, `SignupForm`, `ProtectedRoute`

**Product** — `ProductCard`, `ProductGrid`, `ProductDetails`, `ProductFilter`, `ProductSearch`

**Cart** — `CartItem`, `CartSummary`, `CartDrawer`

**Checkout** — `CheckoutSteps`, `ShippingForm`, `PaymentForm`, `OrderSummary`

**Account** — `ProfileForm`, `AddressCard`, `OrderCard`

### API Service Layer (`src/api/`)
Each domain has a dedicated module (`auth.api.js`, `product.api.js`, etc.) built on a shared Axios instance. All responses follow the shape `{ success: bool, data: {...}, message: string }`.

---

## Authentication Flow

1. **Signup/Login** — credentials validated by Joi → bcrypt hash comparison → JWT generated → set in httpOnly cookie
2. **Session restore** — on app load, `AuthContext` calls `GET /api/auth/me`; if JWT cookie is valid, user state is restored
3. **Route protection** — `ProtectedRoute` checks `isAuthenticated`; redirects to `/login` otherwise
4. **Guest carts** — `session.js` middleware assigns a `session_id` cookie to unauthenticated requests; cart is linked to this ID
5. **Cart merge** — after login, frontend calls `POST /api/cart/merge` to combine the guest cart into the user's account cart

---

## Known Gaps / Future Work

- Profile editing, order history, and order detail pages are scaffolded but not fully implemented
- No real payment gateway integration (payment form is a UI placeholder)
- Product reviews/ratings UI exists in the schema but write-path not fully wired
- Wishlist, admin dashboard, and advanced analytics are not yet built
- No email sending for password reset (endpoint exists, email delivery not implemented)

---

## npm Scripts Reference

### Backend
```bash
npm start          # Production: node src/server.js
npm run dev        # Development: nodemon auto-reload
npm run db:create  # Create MySQL database
npm run db:tables  # Run table migrations
npm run db:seed    # Insert sample data
npm run db:setup   # All three above in sequence
```

### Frontend
```bash
npm start          # Dev server on port 3000
npm run build      # Production build to /build
npm test           # Run test suite
```
