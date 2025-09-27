import User from "../models/user.js";
import ErrorHandler from "../utils/errorHandler.js";

export const isAuthenticatedUser = async (req, res, next) => {
    try {
        if (!req.session.userId) {
            return next(
                new ErrorHandler("Login first to access this resource", 401)
            );
        }
        req.user = await User.findById(req.session.userId);
        if (!req.user) {
            return next(new ErrorHandler("User not found", 401));
        }
        next();
    } catch (error) {
        return next(new ErrorHandler("Authentication failed", 401));
    }
};

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `Role (${req.user?.role}) is not allowed to access this resource`,
                    403
                )
            );
        }
        next();
    };
};
