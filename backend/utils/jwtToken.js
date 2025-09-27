// Create and send token and save in cookie
const sendToken = (user, statusCode, res) => {
    // Create JWT Token
    const token = user.getJWTToken();

    // Options for cookie
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        sameSite: "lax", // or "none" if using HTTPS
        secure: false, // true if using HTTPS
    };

    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        token,
        user,
    });
};

module.exports = sendToken;
