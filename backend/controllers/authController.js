const User = require("../models/user");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwtToken");
const crypto = require("crypto");

// Register a user => /api/v1/auth/register
exports.registerUser = async (req, res, next) => {
    try {
        const { name, email, password, phone } = req.body;

        const user = await User.create({
            name,
            email,
            password,
            phone,
            addresses: [],
        });

        sendToken(user, 201, res);
    } catch (error) {
        next(error);
    }
};

// Login user => /api/v1/auth/login
exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if email and password is entered by user
        if (!email || !password) {
            return next(new ErrorHandler("Please enter email & password", 400));
        }

        // Finding user in database
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return next(new ErrorHandler("Invalid Email or Password", 401));
        }

        // Check if password is correct
        const isPasswordMatched = await user.comparePassword(password);

        if (!isPasswordMatched) {
            return next(new ErrorHandler("Invalid Email or Password", 401));
        }

        sendToken(user, 200, res);
    } catch (error) {
        next(error);
    }
};

// Logout user => /api/v1/auth/logout
exports.logout = async (req, res, next) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        });

        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        next(error);
    }
};

// Get currently logged in user details => /api/v1/auth/me
exports.getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        next(error);
    }
};

// Update / Change password => /api/v1/auth/password/update
exports.updatePassword = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select("+password");

        // Check previous user password
        const isMatched = await user.comparePassword(req.body.oldPassword);
        if (!isMatched) {
            return next(new ErrorHandler("Old password is incorrect", 400));
        }

        user.password = req.body.password;
        await user.save();

        sendToken(user, 200, res);
    } catch (error) {
        next(error);
    }
};

// Update user profile => /api/v1/auth/me/update
exports.updateProfile = async (req, res, next) => {
    try {
        const newUserData = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
        };

        const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        next(error);
    }
};

// Add/Update address => /api/v1/auth/address
exports.updateAddress = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

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

        res.status(200).json({
            success: true,
            addresses: user.addresses,
        });
    } catch (error) {
        next(error);
    }
};
