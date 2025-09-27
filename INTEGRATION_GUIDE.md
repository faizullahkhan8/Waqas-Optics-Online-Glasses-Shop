# Frontend-Backend Integration with TanStack Query

## Overview

This document outlines the integration between the Waqas Optics frontend (React) and backend (Node.js/Express) using TanStack Query (React Query) for efficient data fetching, caching, and state management.

## Architecture

### Frontend Stack

-   **React 19** - UI Framework
-   **TanStack Query** - Server state management and data fetching
-   **Axios** - HTTP client for API requests
-   **Redux Toolkit** - Client-side state management (for UI state)
-   **Tailwind CSS** - Styling
-   **React Router** - Navigation

### Backend Stack

-   **Node.js/Express** - Server framework
-   **MongoDB/Mongoose** - Database
-   **JWT** - Authentication
-   **Cloudinary** - Image storage
-   **Stripe** - Payment processing

## Integration Setup

### 1. Package Installation

```bash
# Frontend packages installed
npm install @tanstack/react-query @tanstack/react-query-devtools axios
```

### 2. Configuration Files

#### Frontend API Configuration (`src/lib/api.js`)

-   Axios instance with base URL configuration
-   Request/Response interceptors for authentication
-   Error handling for 401 responses

#### Query Client Setup (`src/lib/queryClient.js`)

-   TanStack Query client configuration
-   Default query and mutation options
-   Retry logic and cache settings

### 3. Environment Variables

#### Frontend (`.env`)

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_BACKEND_URL=http://localhost:5000
VITE_NODE_ENV=development
```

#### Backend (`.env`)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/waqas_optics
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_key_here
# ... other variables
```

## API Services Structure

### 1. Product Service (`services/productService.js`)

-   `getProducts(params)` - Get all products with filters
-   `getProduct(id)` - Get single product
-   `searchProducts(query, filters)` - Search products
-   `getFeaturedProducts()` - Get featured products
-   `createProduct()` - Admin: Create product
-   `updateProduct()` - Admin: Update product
-   `deleteProduct()` - Admin: Delete product

### 2. Authentication Service (`services/authService.js`)

-   `register(userData)` - User registration
-   `login(credentials)` - User login
-   `logout()` - User logout
-   `getProfile()` - Get user profile
-   `updateProfile()` - Update user profile
-   `changePassword()` - Change password
-   `forgotPassword()` - Password reset request
-   `resetPassword()` - Password reset

### 3. Cart Service (`services/cartService.js`)

-   `getCart()` - Get user's cart
-   `addToCart(itemData)` - Add item to cart
-   `updateCartItem(itemId, quantity)` - Update cart item
-   `removeFromCart(itemId)` - Remove item from cart
-   `clearCart()` - Clear entire cart

### 4. Order Service (`services/orderService.js`)

-   `getOrders()` - Get user's orders
-   `getOrder(orderId)` - Get single order
-   `createOrder(orderData)` - Create new order
-   `updateOrderStatus()` - Admin: Update order status
-   `cancelOrder()` - Cancel order

## React Query Hooks

### 1. Product Hooks (`hooks/useProducts.js`)

-   `useProducts(filters)` - Get products with filtering
-   `useProduct(id)` - Get single product
-   `useSearchProducts(query, filters)` - Search products
-   `useFeaturedProducts()` - Get featured products
-   `useCreateProduct()` - Admin: Create product
-   `useUpdateProduct()` - Admin: Update product
-   `useDeleteProduct()` - Admin: Delete product

### 2. Auth Hooks (`hooks/useAuth.js`)

-   `useProfile()` - Get user profile
-   `useLogin()` - Login mutation
-   `useRegister()` - Register mutation
-   `useLogout()` - Logout mutation
-   `useUpdateProfile()` - Update profile mutation
-   `useChangePassword()` - Change password mutation
-   `useForgotPassword()` - Forgot password mutation
-   `useResetPassword()` - Reset password mutation

### 3. Cart Hooks (`hooks/useCart.js`)

-   `useCart()` - Get cart items
-   `useAddToCart()` - Add to cart mutation
-   `useUpdateCartItem()` - Update cart item mutation
-   `useRemoveFromCart()` - Remove from cart mutation
-   `useClearCart()` - Clear cart mutation

### 4. Order Hooks (`hooks/useOrders.js`)

-   `useOrders()` - Get user orders
-   `useOrder(orderId)` - Get single order
-   `useCreateOrder()` - Create order mutation
-   `useUpdateOrderStatus()` - Admin: Update order status
-   `useCancelOrder()` - Cancel order mutation

## Query Key Structure

### Product Keys

```javascript
productKeys = {
    all: ["products"],
    lists: () => [...productKeys.all, "list"],
    list: (filters) => [...productKeys.lists(), { filters }],
    details: () => [...productKeys.all, "detail"],
    detail: (id) => [...productKeys.details(), id],
    search: (query) => [...productKeys.all, "search", query],
    featured: () => [...productKeys.all, "featured"],
    category: (category) => [...productKeys.all, "category", category],
};
```

## Component Integration Examples

### 1. Shop Page Integration

```jsx
// Fetch products using React Query
const productsQuery = useProducts({
    category: category !== "all" ? category : undefined,
    gender: filters.gender !== "all" ? filters.gender : undefined,
    // ... other filters
});

// Handle loading and error states
const isLoading = productsQuery.isLoading;
const error = productsQuery.error;
const products = productsQuery.data?.products || [];
```

### 2. Home Page Integration

```jsx
// Fetch featured products
const { data: featuredProductsData, isLoading, error } = useFeaturedProducts();
const featuredProducts =
    featuredProductsData?.products || SAMPLE_PRODUCTS.slice(0, 8);
```

### 3. Login Page Integration

```jsx
const loginMutation = useLogin();

// Handle login
loginMutation.mutate(formData, {
    onSuccess: (data) => {
        dispatch(setUser(data.user));
        navigate("/account");
    },
});
```

## Fallback Strategy

The integration includes a fallback strategy for graceful degradation:

1. **API First**: Attempt to fetch data from backend API
2. **Mock Data Fallback**: If API fails, fall back to mock data
3. **Error Handling**: Display appropriate error messages
4. **Loading States**: Show loading indicators during API calls

## Error Handling

### 1. Global Error Handling

-   Axios interceptors for 401 responses
-   Automatic token refresh logic
-   Redirect to login on authentication errors

### 2. Component-Level Error Handling

-   Loading states in components
-   Error boundaries for React errors
-   Toast notifications for user feedback

### 3. Mutation Error Handling

-   Optimistic updates with rollback
-   Error messages in toast notifications
-   Form validation error display

## Cache Management

### 1. Query Invalidation

-   Automatic invalidation after mutations
-   Manual invalidation for data consistency
-   Smart invalidation based on query keys

### 2. Cache Configuration

-   5-minute stale time for queries
-   10-minute cache time for data retention
-   Background refetching on window focus (disabled)

## Development Tools

### 1. React Query Devtools

-   Available in development mode
-   Query inspection and debugging
-   Cache visualization

### 2. Network Monitoring

-   Axios request/response logging
-   API call debugging
-   Performance monitoring

## Running the Application

### 1. Start Backend Server

```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

### 2. Start Frontend Server

```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

### 3. Access Application

-   Frontend: http://localhost:5173
-   Backend API: http://localhost:5000/api/v1
-   React Query Devtools: Available in browser dev tools

## Next Steps

1. **Database Setup**: Configure MongoDB connection
2. **Authentication**: Implement JWT token management
3. **File Uploads**: Set up Cloudinary integration
4. **Payment Processing**: Integrate Stripe for payments
5. **Testing**: Add unit and integration tests
6. **Deployment**: Configure production environment

## Benefits of This Integration

1. **Efficient Data Fetching**: TanStack Query handles caching, background updates, and synchronization
2. **Better User Experience**: Loading states, error handling, and optimistic updates
3. **Development Experience**: React Query devtools and clear separation of concerns
4. **Performance**: Smart caching and request deduplication
5. **Maintainability**: Organized service layer and reusable hooks
6. **Scalability**: Easy to extend with new endpoints and features
