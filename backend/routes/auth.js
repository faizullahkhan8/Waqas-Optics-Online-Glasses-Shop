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

// test route
router.get("/test", (req, res) => {
    res.status(200).json({
        message: "working...",
    });
});

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);

// Protected routes
router.get("/me", isAuthenticatedUser, getUserProfile);
router.put("/password/update", isAuthenticatedUser, updatePassword);
router.put("/me/update", isAuthenticatedUser, updateProfile);
router.post("/address", isAuthenticatedUser, updateAddress);

module.exports = router;
