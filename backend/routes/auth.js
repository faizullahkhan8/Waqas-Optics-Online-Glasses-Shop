import express from "express";
import { check } from "express-validator";
const router = express.Router();

import {
    registerUser,
    loginUser,
    logout,
    getUserProfile,
    updatePassword,
    updateProfile,
    updateAddress,
} from "../controllers/authController.js";

import { isAuthenticatedUser } from "../middleware/auth.js";

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

export default router;
