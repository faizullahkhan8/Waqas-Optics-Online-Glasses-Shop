const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const {
    registerUser,
    loginUser,
    logout,
    getUserProfile,
    updatePassword,
    updateProfile,
    updateAddress,
} = require("../controllers/authController");

const { isAuthenticatedUser } = require("../middleware/auth");

// Input validation middleware
const registerValidation = [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
        "password",
        "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
    check("phone", "Phone number is required").not().isEmpty(),
];

const loginValidation = [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
];

const addressValidation = [
    check("line1", "Address line 1 is required").not().isEmpty(),
    check("city", "City is required").not().isEmpty(),
    check("state", "State is required").not().isEmpty(),
    check("country", "Country is required").not().isEmpty(),
    check("postalCode", "Postal code is required").not().isEmpty(),
];

// Auth routes
router.post("/register", registerValidation, registerUser);
router.post("/login", loginValidation, loginUser);
router.get("/logout", logout);

// Protected routes
router.get("/me", isAuthenticatedUser, getUserProfile);
router.put("/password/update", isAuthenticatedUser, updatePassword);
router.put("/me/update", isAuthenticatedUser, updateProfile);
router.post("/address", isAuthenticatedUser, addressValidation, updateAddress);

module.exports = router;
