const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter product name"],
        trim: true,
        maxLength: [100, "Product name cannot exceed 100 characters"],
    },
    description: {
        type: String,
        required: [true, "Please enter product description"],
    },
    price: {
        type: Number,
        required: [true, "Please enter product price"],
        maxLength: [8, "Price cannot exceed 8 characters"],
        default: 0.0,
    },
    images: [
        {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        },
    ],
    category: {
        type: String,
        required: [true, "Please select category for this product"],
        enum: {
            values: [
                "Eyeglasses",
                "Sunglasses",
                "Contact Lenses",
                "Reading Glasses",
                "Sports Eyewear",
            ],
            message: "Please select correct category",
        },
    },
    brand: {
        type: String,
        required: [true, "Please enter product brand"],
    },
    stock: {
        type: Number,
        required: [true, "Please enter product stock"],
        maxLength: [5, "Stock cannot exceed 5 characters"],
        default: 0,
    },
    attributes: {
        frameSize: {
            type: String,
            enum: ["Small", "Medium", "Large"],
        },
        frameColor: String,
        frameMaterial: String,
        lensType: {
            type: String,
            enum: ["Single Vision", "Bifocal", "Progressive", "Polarized"],
        },
        gender: {
            type: String,
            enum: ["Men", "Women", "Unisex"],
        },
    },
    ratings: {
        type: Number,
        default: 0,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Product", productSchema);
