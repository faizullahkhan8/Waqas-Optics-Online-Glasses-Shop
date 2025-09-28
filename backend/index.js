import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import session from "express-session";
import MongoStore from "connect-mongo";

// routes
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/product.js";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/order.js";
import adminRoutes from "./routes/admin.js";
import additionalRoutes from "./routes/additional.js";
import paymentRoutes from "./routes/payment.js";

// Load environment variables
dotenv.config();

// Connect Database
import connectDatabase from "./config/database.js";
connectDatabase();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));

// Express session setup
app.use(
    session({
        secret: process.env.SESSION_SECRET || "supersecretkey",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24, // 1 day
            sameSite: "lax",
        },
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI,
            collectionName: "sessions",
        }),
    })
);

// Setup CORS
app.use(
    cors({
        origin: ["http://localhost:3001", "http://localhost:3002"], // or your deployed frontend URL
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// // Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use("/api", limiter);

// Specific rate limiting for payment operations
const paymentLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 payment requests per windowMs
    message: "Too many payment requests, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/api/v1/payment", paymentLimiter);

// Use route references here
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/additional", additionalRoutes);
app.use("/api/v1/payment", paymentRoutes);

// Error Middleware
import errorMiddleware from "./middleware/error.js";
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT} in ${process.env.NODE_ENV} mode`
    );
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down server due to unhandled Promise rejection");
    server.close(() => {
        process.exit(1);
    });
});
