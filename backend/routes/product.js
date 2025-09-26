const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const {
    getProducts,
    createProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    getProductReviews,
    deleteReview,
} = require("../controllers/productController");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const upload = require("../middleware/upload");

// Validation middleware
const productValidation = [
    check("name", "Product name is required").not().isEmpty(),
    check("description", "Description is required").not().isEmpty(),
    check("price", "Price is required and must be a number").isNumeric(),
    check("category", "Category is required").not().isEmpty(),
    check("brand", "Brand is required").not().isEmpty(),
    check("stock", "Stock is required and must be a number").isNumeric(),
];

const reviewValidation = [
    check("rating", "Rating is required and must be between 1 and 5").isFloat({
        min: 1,
        max: 5,
    }),
    check("comment", "Comment is required").not().isEmpty(),
    check("productId", "Product ID is required").not().isEmpty(),
];

// Public routes
router.route("/products").get(getProducts);
router.route("/product/:id").get(getSingleProduct);
router.route("/reviews").get(getProductReviews);

// Protected routes
router
    .route("/review")
    .put(isAuthenticatedUser, reviewValidation, createProductReview)
    .delete(isAuthenticatedUser, deleteReview);

// Admin routes
router
    .route("/admin/product/new")
    .post(
        isAuthenticatedUser,
        authorizeRoles("admin"),
        upload.array("images", 5),
        productValidation,
        createProduct
    );

router
    .route("/admin/product/:id")
    .put(
        isAuthenticatedUser,
        authorizeRoles("admin"),
        upload.array("images", 5),
        updateProduct
    )
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

module.exports = router;
