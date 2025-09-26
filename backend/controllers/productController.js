const Product = require("../models/product");
const ErrorHandler = require("../utils/errorHandler");
const cloudinary = require("../utils/cloudinary");
const APIFeatures = require("../utils/apiFeatures");

// Create new product => /api/v1/admin/product/new
exports.createProduct = async (req, res, next) => {
    try {
        req.body.createdBy = req.user.id;

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
exports.getProducts = async (req, res, next) => {
    try {
        const resPerPage = 12;
        const productsCount = await Product.countDocuments();

        const apiFeatures = new APIFeatures(Product.find(), req.query)
            .search()
            .filter();

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
exports.getSingleProduct = async (req, res, next) => {
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
exports.updateProduct = async (req, res, next) => {
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
exports.deleteProduct = async (req, res, next) => {
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
exports.createProductReview = async (req, res, next) => {
    try {
        const { rating, comment, productId } = req.body;

        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment,
        };

        const product = await Product.findById(productId);

        const isReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (isReviewed) {
            product.reviews.forEach((review) => {
                if (review.user.toString() === req.user._id.toString()) {
                    review.comment = comment;
                    review.rating = rating;
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
exports.getProductReviews = async (req, res, next) => {
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
exports.deleteReview = async (req, res, next) => {
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
