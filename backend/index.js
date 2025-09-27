const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

// Load environment variables
dotenv.config();

// Connect Database
const connectDatabase = require("./config/database");
connectDatabase();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));

// Setup CORS
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use("/api", limiter);

// Routes
app.use("/api/v1/auth", require("./routes/auth"));
app.use("/api/v1/products", require("./routes/product"));
app.use("/api/v1/cart", require("./routes/cart"));
app.use("/api/v1/orders", require("./routes/order"));
app.use("/api/v1/admin", require("./routes/admin"));
app.use("/api/v1/additional", require("./routes/additional"));

// Error Middleware
const errorMiddleware = require("./middleware/error");
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
