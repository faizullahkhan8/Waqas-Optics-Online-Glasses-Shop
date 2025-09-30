/**
 * Safe utility functions to prevent undefined/null errors with arrays and objects
 */

/**
 * Safely get the length of an array or array-like object
 * @param {*} value - The value to check
 * @param {number} defaultValue - Default value to return if not an array (default: 0)
 * @returns {number} The length or default value
 */
export const safeLength = (value, defaultValue = 0) => {
    if (Array.isArray(value)) {
        return value.length;
    }
    if (
        value &&
        typeof value === "object" &&
        value.items &&
        Array.isArray(value.items)
    ) {
        return value.items.length;
    }
    if (value && typeof value === "string") {
        return value.length;
    }
    return defaultValue;
};

/**
 * Safely check if an array or array-like object has items
 * @param {*} value - The value to check
 * @returns {boolean} True if has items, false otherwise
 */
export const hasItems = (value) => {
    return safeLength(value) > 0;
};

/**
 * Safely get an array from a value, handling both direct arrays and objects with items property
 * @param {*} value - The value to extract array from
 * @param {Array} defaultValue - Default array to return (default: [])
 * @returns {Array} The array or default value
 */
export const safeArray = (value, defaultValue = []) => {
    if (Array.isArray(value)) {
        return value;
    }
    if (
        value &&
        typeof value === "object" &&
        value.items &&
        Array.isArray(value.items)
    ) {
        return value.items;
    }
    return defaultValue;
};

/**
 * Safely get a count display text for items
 * @param {*} value - The value to count
 * @param {string} singular - Singular form (default: 'item')
 * @param {string} plural - Plural form (default: 'items')
 * @returns {string} Formatted count text
 */
export const getCountText = (value, singular = "item", plural = "items") => {
    const count = safeLength(value);
    if (count === 0) {
        return `No ${plural}`;
    }
    return `${count} ${count === 1 ? singular : plural}`;
};

/**
 * Safely check if a value is empty (null, undefined, empty array, empty object with no items)
 * @param {*} value - The value to check
 * @returns {boolean} True if empty, false otherwise
 */
export const isEmpty = (value) => {
    if (value === null || value === undefined) {
        return true;
    }
    if (Array.isArray(value)) {
        return value.length === 0;
    }
    if (value && typeof value === "object" && value.items) {
        return !Array.isArray(value.items) || value.items.length === 0;
    }
    return false;
};

/**
 * Safely get error message for empty states
 * @param {*} value - The value to check
 * @param {string} emptyMessage - Message to show when empty
 * @param {string} loadingMessage - Message to show when loading (default: 'Loading...')
 * @returns {string|null} Error message or null if not empty
 */
export const getEmptyStateMessage = (
    value,
    emptyMessage,
    loadingMessage = "Loading..."
) => {
    if (value === undefined) {
        return loadingMessage;
    }
    if (isEmpty(value)) {
        return emptyMessage;
    }
    return null;
};
