# Waqas Optics - Online Glasses Shop

A full-stack MERN (MongoDB, Express.js, React, Node.js) e-commerce application for an online optics shop specializing in eyeglasses, sunglasses, contact lenses, and related eyewear products.

## 🚀 Features

### Customer Features

-   **Product Browsing**: Browse through a wide range of eyewear products with advanced filtering and sorting
-   **Product Search**: Search products by name, category, brand, or attributes
-   **Product Details**: Detailed product pages with images, specifications, and reviews
-   **User Authentication**: Secure registration and login with session-based authentication
-   **Shopping Cart**: Add, update, and remove items from the cart
-   **Wishlist**: Save favorite products for later
-   **Secure Checkout**: Integrated Stripe payment processing
-   **Order Management**: View order history and track order status
-   **Responsive Design**: Mobile-friendly interface

### Admin Features

-   **Dashboard Analytics**: Overview of sales, orders, and user statistics
-   **Product Management**: Add, edit, and delete products with image uploads
-   **Order Management**: View and update order statuses
-   **User Management**: Manage user accounts and permissions
-   **Category Management**: Organize products by categories and attributes

## 🛠 Tech Stack

### Frontend (Customer)

-   **React 18** with Vite for fast development
-   **React Router v6** for client-side routing
-   **TanStack Query** for data fetching and caching
-   **Redux Toolkit** for state management
-   **Axios** for API calls
-   **Stripe.js** for payment processing
-   **Tailwind CSS** for styling

### Frontend (Admin)

-   **React 18** with Vite
-   **React Router v6**
-   **Axios** for API calls
-   **Chart.js** for analytics visualization

### Backend

-   **Node.js** with Express.js
-   **MongoDB** with Mongoose ODM
-   **Express Session** for session management
-   **Stripe SDK** for payment processing
-   **Cloudinary** for image uploads
-   **JWT** for token-based authentication
-   **bcryptjs** for password hashing
-   **express-validator** for input validation
-   **express-rate-limit** for rate limiting
-   **helmet** for security headers
-   **morgan** for logging

## 📁 Project Structure

```
waqas-optics-online-shop/
├── admin-dashboard/          # Admin panel React app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── store/
│   ├── package.json
│   └── vite.config.js
├── backend/                  # Express.js API server
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── index.js
│   └── package.json
├── frontend/                 # Customer-facing React app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── store/
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites

-   Node.js (v16 or higher)
-   MongoDB (local or Atlas)
-   npm or yarn
-   Git

### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/faizullahkhan8/Waqas-Optics-Online-Glasses-Shop.git
    cd waqas-optics-online-shop
    ```

2. **Install dependencies for all parts**

    **Backend:**

    ```bash
    cd backend
    npm install
    cd ..
    ```

    **Frontend:**

    ```bash
    cd frontend
    npm install
    cd ..
    ```

    **Admin Dashboard:**

    ```bash
    cd admin-dashboard
    npm install
    cd ..
    ```

3. **Environment Setup**

    Create `.env` files in `backend/` and `frontend/` directories.

    **Backend `.env`:**

    ```env
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/waqas_optics
    JWT_SECRET=your_jwt_secret_key_here
    JWT_EXPIRE=7d
    COOKIE_EXPIRE=7
    SESSION_SECRET=your_super_secret_session_key_here

    # Cloudinary Config
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret

    # Stripe Config
    STRIPE_PUBLISHABLE_KEY=pk_test_...
    STRIPE_SECRET_KEY=sk_test_...
    STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

    # Frontend URL for CORS
    FRONTEND_URL=http://localhost:5173
    NODE_ENV=development
    ```

    **Frontend `.env`:**

    ```env
    VITE_API_URL=http://localhost:5000/api/v1
    VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
    ```

4. **Database Setup**

    - Ensure MongoDB is running locally or update `MONGODB_URI` for Atlas
    - The application will create collections automatically

5. **Stripe Setup**
    - Create a Stripe account at https://stripe.com
    - Get your publishable and secret keys
    - Update the `.env` files with your Stripe keys

## 🏃 Running the Application

### Development Mode

1. **Start Backend Server:**

    ```bash
    cd backend
    npm run dev
    ```

    Server will run on http://localhost:5000

2. **Start Frontend:**

    ```bash
    cd frontend
    npm run dev
    ```

    App will run on http://localhost:5173

3. **Start Admin Dashboard:**
    ```bash
    cd admin-dashboard
    npm run dev
    ```
    Admin panel will run on http://localhost:5174

### Production Build

1. **Build Frontend:**

    ```bash
    cd frontend
    npm run build
    ```

2. **Build Admin Dashboard:**

    ```bash
    cd admin-dashboard
    npm run build
    ```

3. **Start Backend:**
    ```bash
    cd backend
    npm start
    ```

## 📡 API Endpoints

### Authentication

-   `POST /api/v1/auth/register` - User registration
-   `POST /api/v1/auth/login` - User login
-   `GET /api/v1/auth/logout` - User logout
-   `GET /api/v1/auth/me` - Get current user profile

### Products

-   `GET /api/v1/products` - Get all products (with filtering/sorting)
-   `GET /api/v1/products/:id` - Get single product
-   `GET /api/v1/products/featured` - Get featured products

### Cart

-   `GET /api/v1/cart` - Get user's cart
-   `POST /api/v1/cart/add` - Add item to cart
-   `PUT /api/v1/cart/update` - Update cart item
-   `DELETE /api/v1/cart/remove` - Remove item from cart
-   `DELETE /api/v1/cart/clear` - Clear cart

### Orders

-   `POST /api/v1/orders/new` - Create new order
-   `GET /api/v1/orders/:id` - Get single order
-   `GET /api/v1/orders/myorders` - Get user's orders

### Admin

-   `POST /api/v1/admin/product/new` - Create product
-   `PUT /api/v1/admin/product/:id` - Update product
-   `DELETE /api/v1/admin/product/:id` - Delete product
-   `GET /api/v1/admin/orders` - Get all orders
-   `PUT /api/v1/admin/order/:id` - Update order status

## 🔧 Available Scripts

### Backend

-   `npm run dev` - Start development server with nodemon
-   `npm start` - Start production server
-   `npm test` - Run tests

### Frontend & Admin

-   `npm run dev` - Start development server
-   `npm run build` - Build for production
-   `npm run preview` - Preview production build

## 🧪 Testing

### Manual Testing

1. Register a new user account
2. Browse and search products
3. Add products to cart and wishlist
4. Complete checkout with Stripe test card
5. View order history
6. Test admin features (product management, order updates)

### API Testing

Use tools like Postman or Insomnia to test API endpoints.

## 🚀 Deployment

### Backend Deployment

1. Set `NODE_ENV=production` in environment variables
2. Use a process manager like PM2
3. Set up reverse proxy with Nginx
4. Configure SSL certificate

### Frontend Deployment

1. Build the application: `npm run build`
2. Deploy to hosting platforms like Vercel, Netlify, or AWS S3
3. Configure environment variables

### Database

-   Use MongoDB Atlas for cloud database
-   Set up database backups
-   Configure connection pooling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

### Development Guidelines

-   Follow ESLint configuration
-   Write meaningful commit messages
-   Test your changes thoroughly
-   Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support or questions, please open an issue on GitHub or contact the development team.

## 🙏 Acknowledgments

-   React, Node.js, and MongoDB communities
-   Stripe for payment processing
-   All contributors and supporters

---

**Note:** This is a development project. For production use, ensure proper security measures, testing, and monitoring are in place.
