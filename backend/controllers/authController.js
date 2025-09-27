import User from "../models/user.js";
import ErrorHandler from "../utils/errorHandler.js";
import crypto from "crypto";

// Register a user => /api/v1/auth/register
export const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, phone } = req.body;
        const user = await User.create({
            name,
            email,
            password,
            phone,
            addresses: [],
        });
        req.session.userId = user._id;
        res.status(201).json({ success: true, user });
    } catch (error) {
        next(error);
    }
};

// Login user => /api/v1/auth/login
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ErrorHandler("Please enter email & password", 400));
        }
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return next(new ErrorHandler("Invalid Email or Password", 401));
        }
        const isPasswordMatched = await user.comparePassword(password);
        if (!isPasswordMatched) {
            return next(new ErrorHandler("Invalid Email or Password", 401));
        }
        req.session.userId = user._id;
        res.status(200).json({ success: true, user });
    } catch (error) {
        next(error);
    }
};

// Logout user => /api/v1/auth/logout
export const logout = async (req, res, next) => {
    try {
        req.session.destroy((err) => {
            if (err) return next(err);
            res.clearCookie("connect.sid");
            res.status(200).json({
                success: true,
                message: "Logged out successfully",
            });
        });
    } catch (error) {
        next(error);
    }
};

// Get currently logged in user details => /api/v1/auth/me
export const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        next(error);
    }
};

// Update / Change password => /api/v1/auth/password/update
export const updatePassword = async (req, res, next) => {
    try {
        const user = await User.findById(req.session.userId).select(
            "+password"
        );
        const isMatched = await user.comparePassword(req.body.oldPassword);
        if (!isMatched) {
            return next(new ErrorHandler("Old password is incorrect", 400));
        }
        user.password = req.body.password;
        await user.save();
        res.status(200).json({ success: true, user });
    } catch (error) {
        next(error);
    }
};

// Update user profile => /api/v1/auth/me/update
export const updateProfile = async (req, res, next) => {
    try {
        const newUserData = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
        };
        const user = await User.findByIdAndUpdate(
            req.session.userId,
            newUserData,
            {
                new: true,
                runValidators: true,
            }
        );
        res.status(200).json({ success: true, user });
    } catch (error) {
        next(error);
    }
};

// Add/Update address => /api/v1/auth/address
export const updateAddress = async (req, res, next) => {
    try {
        const user = await User.findById(req.session.userId);
        const newAddress = {
            line1: req.body.line1,
            line2: req.body.line2,
            city: req.body.city,
            state: req.body.state,
            postalCode: req.body.postalCode,
            country: req.body.country,
            isDefault: req.body.isDefault || false,
        };
        // If address is set as default, remove default from other addresses
        if (newAddress.isDefault) {
            user.addresses.forEach((addr) => (addr.isDefault = false));
        }
        // If updating existing address
        if (req.body.addressId) {
            const addressIndex = user.addresses.findIndex(
                (addr) => addr._id.toString() === req.body.addressId
            );
            if (addressIndex >= 0) {
                user.addresses[addressIndex] = newAddress;
            }
        } else {
            // Adding new address
            user.addresses.push(newAddress);
        }
        await user.save();
        res.status(200).json({ success: true, addresses: user.addresses });
    } catch (error) {
        next(error);
    }
};
