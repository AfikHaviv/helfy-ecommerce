# Helfy eCommerce - Frontend

React-based frontend for the Helfy eCommerce platform with premium UI using Tailwind CSS and Framer Motion.

## Tech Stack

- **React 18.x** - UI library
- **React Router v6** - Client-side routing
- **Tailwind CSS 3.x** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **Context API + useReducer** - State management

## Project Structure

```
frontend/
├── public/              # Static files
├── src/
│   ├── api/            # API service layer
│   ├── components/     # Reusable components
│   │   ├── auth/       # Authentication components
│   │   ├── cart/       # Cart components
│   │   ├── checkout/   # Checkout components
│   │   ├── common/     # Common UI components
│   │   └── product/    # Product components
│   ├── context/        # React Context providers
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main app component with routing
│   ├── index.js        # Entry point
│   └── index.css       # Global styles
├── .env                # Environment variables
├── tailwind.config.js  # Tailwind configuration
└── package.json        # Dependencies
```

## Implemented Pages

### ✅ Completed (Phase 3 - Reduced Scope)
1. **Login** - User authentication
2. **Signup** - User registration
3. **Products** - Product listing with filters, search, and pagination
4. **ProductDetail** - Detailed product view with image gallery
5. **Cart** - Shopping cart management
6. **Checkout** - Multi-step checkout process (Shipping → Payment → Review)
7. **Profile** - User profile (placeholder)
8. **OrderHistory** - Order history (placeholder)
9. **OrderDetail** - Order details (placeholder)
10. **OrderConfirmation** - Order success page
11. **NotFound** - 404 error page

## Features

### Authentication
- JWT-based authentication with httpOnly cookies
- Protected routes for authenticated users
- Persistent login state

### Product Browsing
- Product grid with responsive design
- Advanced filtering (category, price range, stock status)
- Search functionality with debouncing
- Sorting options
- Pagination

### Shopping Cart
- Add/remove items
- Update quantities
- Real-time cart total calculation
- Cart persistence
- Free shipping threshold indicator

### Checkout Process
- Three-step checkout flow
- Shipping address form
- Payment method selection
- Order review before placement
- Order confirmation

### UI/UX
- Premium design with Tailwind CSS
- Smooth animations with Framer Motion
- Responsive layout (mobile, tablet, desktop)
- Loading states and error handling
- Toast notifications

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
REACT_APP_API_URL=http://localhost:5000/api
```

3. Start development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## API Integration

The frontend communicates with the backend API through axios instances configured in `src/api/`:

- `auth.api.js` - Authentication endpoints
- `user.api.js` - User management
- `product.api.js` - Product operations
- `category.api.js` - Category operations
- `cart.api.js` - Cart management
- `order.api.js` - Order operations

## State Management

### Contexts
- **AuthContext** - User authentication state
- **CartContext** - Shopping cart state
- **ThemeContext** - Theme preferences

### Custom Hooks
- `useAuth()` - Access authentication state
- `useCart()` - Access cart state
- `useProducts()` - Fetch and manage products
- `useDebounce()` - Debounce input values

## Styling

- **Tailwind CSS** for utility-first styling
- **Framer Motion** for animations
- Custom utility classes in `index.css`
- Responsive design with mobile-first approach

## Notes

- Backend must be running on port 5000
- Database must be seeded with products
- Some pages (Profile, OrderHistory, OrderDetail) are placeholders for future implementation

## Next Steps

To complete the full implementation:
1. Implement full Profile page with user data editing
2. Implement OrderHistory with real order data
3. Implement OrderDetail with complete order information
4. Add product reviews functionality
5. Add wishlist feature
6. Implement admin dashboard
7. Add more payment gateway integrations
8. Enhance error handling and validation

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
