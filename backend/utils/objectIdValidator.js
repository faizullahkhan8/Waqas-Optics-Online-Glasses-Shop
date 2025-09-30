import mongoose from "mongoose";

/**
 * Validate and ensure a valid ObjectId
 * @param {string|ObjectId} id - The ID to validate
 * @param {string} fieldName - Name of the field for error messaging
 * @returns {ObjectId} - Valid ObjectId
 * @throws {Error} - If ID is invalid
 */
export const validateObjectId = (id, fieldName = "ID") => {
    if (!id) {
        throw new Error(`${fieldName} is required`);
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid ${fieldName} format`);
    }

    return new mongoose.Types.ObjectId(id);
};

/**
 * Safely convert string to ObjectId
 * @param {string|ObjectId} id - The ID to convert
 * @returns {ObjectId|null} - Valid ObjectId or null if invalid
 */
export const safeObjectId = (id) => {
    if (!id) return null;

    try {
        if (mongoose.Types.ObjectId.isValid(id)) {
            return new mongoose.Types.ObjectId(id);
        }
        return null;
    } catch (error) {
        return null;
    }
};

/**
 * Check if a string is a valid ObjectId format
 * @param {string} id - The ID to check
 * @returns {boolean} - True if valid ObjectId format
 */
export const isValidObjectId = (id) => {
    return id && mongoose.Types.ObjectId.isValid(id);
};

export default {
    validateObjectId,
    safeObjectId,
    isValidObjectId,
};
