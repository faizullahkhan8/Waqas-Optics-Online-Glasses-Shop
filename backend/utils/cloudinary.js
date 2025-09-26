const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload file to Cloudinary
exports.uploadFile = async (file, folder = "products") => {
    try {
        const result = await cloudinary.uploader.upload(file, {
            folder: folder,
            width: 600,
            crop: "scale",
        });
        return {
            public_id: result.public_id,
            url: result.secure_url,
        };
    } catch (error) {
        throw new Error("Error uploading file to Cloudinary");
    }
};

// Delete file from Cloudinary
exports.deleteFile = async (public_id) => {
    try {
        await cloudinary.uploader.destroy(public_id);
    } catch (error) {
        throw new Error("Error deleting file from Cloudinary");
    }
};
