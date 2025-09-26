const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, "Please enter coupon code"],
        unique: true,
        uppercase: true,
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Please enter coupon description"],
    },
    discountType: {
        type: String,
        required: [true, "Please specify discount type"],
        enum: ["percentage", "fixed"],
    },
    discountAmount: {
        type: Number,
        required: [true, "Please enter discount amount"],
    },
    minimumAmount: {
        type: Number,
        default: 0,
    },
    maxDiscountAmount: {
        type: Number,
    },
    startDate: {
        type: Date,
        required: [true, "Please enter start date"],
        default: Date.now,
    },
    expiryDate: {
        type: Date,
        required: [true, "Please enter expiry date"],
    },
    maxUses: {
        type: Number,
        default: null,
    },
    usedCount: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Coupon", couponSchema);
