import Product from "../models/product.js";
import ErrorHandler from "../utils/errorHandler.js";
import cloudinary from "../utils/cloudinary.js";
import APIFeatures from "../utils/apiFeatures.js";
import mongoose from "mongoose";
import {
    validateObjectId,
    isValidObjectId,
} from "../utils/objectIdValidator.js";

// Create new product => /api/v1/admin/product/new
export const createProduct = async (req, res, next) => {
    try {
        // Ensure user is authenticated and has valid ObjectId
        if (!req.user || !req.user._id) {
            return next(new ErrorHandler("User authentication required", 401));
        }

        // Validate user ObjectId
        try {
            validateObjectId(req.user._id, "User ID");
        } catch (error) {
            return next(new ErrorHandler(error.message, 400));
        }

        req.body.createdBy = req.user._id;

        // Handle image uploads
        const images = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await cloudinary.uploadFile(file.path);
                images.push(result);
            }
        }
        req.body.images = images;

        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            product,
        });
    } catch (error) {
        next(error);
    }
};

// Get all products => /api/v1/products
export const getProducts = async (req, res, next) => {
    try {
        const resPerPage = 12;
        const productsCount = await Product.countDocuments();

        const apiFeatures = new APIFeatures(Product.find({}), req.query)
            .search()
            .filter()
            .sort(); // Added sort functionality

        let products = await apiFeatures.query;
        const filteredProductsCount = products.length;

        apiFeatures.paginate(resPerPage);
        products = await apiFeatures.query.clone();

        res.status(200).json({
            success: true,
            productsCount,
            resPerPage,
            filteredProductsCount,
            products,
        });
    } catch (error) {
        next(error);
    }
};

// Get single product details => /api/v1/product/:id
export const getSingleProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }

        res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        next(error);
    }
};

// Update Product => /api/v1/admin/product/:id
export const updateProduct = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }

        // Handle image updates
        if (req.files && req.files.length > 0) {
            // Delete old images from cloudinary
            for (const image of product.images) {
                await cloudinary.deleteFile(image.public_id);
            }

            // Upload new images
            const images = [];
            for (const file of req.files) {
                const result = await cloudinary.uploadFile(file.path);
                images.push(result);
            }
            req.body.images = images;
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        next(error);
    }
};

// Delete Product => /api/v1/admin/product/:id
export const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }

        // Delete images from cloudinary
        for (const image of product.images) {
            await cloudinary.deleteFile(image.public_id);
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

// Create/Update product review => /api/v1/review
export const createProductReview = async (req, res, next) => {
    try {
        const { rating, comment, productId } = req.body;

        // Validate inputs using utility functions
        try {
            validateObjectId(productId, "Product ID");
            validateObjectId(req.user._id, "User ID");
        } catch (error) {
            return next(new ErrorHandler(error.message, 400));
        }

        const review = {
            user: req.user._id, // Keep as is since it's already validated
            name: req.user.name,
            rating: Number(rating),
            comment,
        };

        const product = await Product.findById(productId);

        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }

        const isReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (isReviewed) {
            product.reviews.forEach((review) => {
                if (review.user.toString() === req.user._id.toString()) {
                    review.comment = comment;
                    review.rating = Number(rating);
                }
            });
        } else {
            product.reviews.push(review);
            product.numOfReviews = product.reviews.length;
        }

        product.ratings =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;

        await product.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
        });
    } catch (error) {
        next(error);
    }
};

// Get Product Reviews => /api/v1/reviews
export const getProductReviews = async (req, res, next) => {
    try {
        const product = await Product.findById(req.query.id);

        res.status(200).json({
            success: true,
            reviews: product.reviews,
        });
    } catch (error) {
        next(error);
    }
};

// Delete Product Review => /api/v1/reviews
export const deleteReview = async (req, res, next) => {
    try {
        const product = await Product.findById(req.query.productId);

        const reviews = product.reviews.filter(
            (review) => review._id.toString() !== req.query.id.toString()
        );

        const numOfReviews = reviews.length;

        const ratings =
            numOfReviews === 0
                ? 0
                : reviews.reduce((acc, item) => item.rating + acc, 0) /
                  numOfReviews;

        await Product.findByIdAndUpdate(
            req.query.productId,
            {
                reviews,
                ratings,
                numOfReviews,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            success: true,
        });
    } catch (error) {
        next(error);
    }
};

// Get featured products => /api/v1/products/featured
export const getFeaturedProducts = async (req, res, next) => {
    try {
        const featuredProducts = await Product.find({});

        res.status(200).json({
            success: true,
            featuredProducts,
        });
    } catch (error) {
        next(error);
    }
};
