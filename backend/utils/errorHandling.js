"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.generalErrorHandler = exports.tokenErrorHandler = exports.customErrorHandler = exports.multerErrorHandler = exports.asyncHandler = exports.CustomError = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const multer_1 = require("multer");
class CustomError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status || 500;
        this.name = "CustomError";
    }
}
exports.CustomError = CustomError;
const asyncHandler = (controller) => {
    return (req, res, next) => {
        controller(req, res, next).catch((err) => {
            next(err);
        });
    };
};
exports.asyncHandler = asyncHandler;
// Multer error handler
const multerErrorHandler = (err, req, res, next) => {
    let message = "File upload error.";
    let statusCode = 400;
    switch (err.code) {
        case "LIMIT_FILE_SIZE":
            message = "File size exceeds the allowed limit.";
            break;
        case "LIMIT_FILE_COUNT":
            message = "Too many files uploaded.";
            break;
        case "LIMIT_UNEXPECTED_FILE":
            message = "Unexpected file field.";
            break;
        default:
            statusCode = 500;
            message = err.message || "File upload error.";
    }
    return res.status(statusCode).json({ success: false, message, statusCode });
};
exports.multerErrorHandler = multerErrorHandler;
// Custom error handler
const customErrorHandler = (err, req, res, next) => {
    return res
        .status(err.status)
        .json({ success: false, message: err.message, statusCode: err.status });
};
exports.customErrorHandler = customErrorHandler;
// Token error handler
const tokenErrorHandler = (err, req, res, next) => {
    let message = "Token Error";
    let statusCode = 500;
    if (err instanceof jsonwebtoken_1.TokenExpiredError) {
        message = "Token verification failed: Token has expired";
        statusCode = 401;
    }
    else if (err instanceof jsonwebtoken_1.NotBeforeError) {
        message = "Token verification failed: Token not active yet";
        statusCode = 401;
    }
    else if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
        message = `Token verification failed: ${err.message}`;
        statusCode = 400;
    }
    else {
        message = "Authentication error. Please login again.";
        statusCode = 401;
    }
    return res.status(statusCode).json({
        success: false,
        message: message,
        statusCode: statusCode,
    });
};
exports.tokenErrorHandler = tokenErrorHandler;
// General error handler
const generalErrorHandler = (err, req, res, next) => {
    const statusCode = 500;
    return res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error.",
        statusCode,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};
exports.generalErrorHandler = generalErrorHandler;
//ERROR HANDLING
const errorHandler = (err, req, res, next) => {
    if (err instanceof multer_1.MulterError) {
        return (0, exports.multerErrorHandler)(err, req, res, next);
    }
    else if (err instanceof CustomError) {
        return (0, exports.customErrorHandler)(err, req, res, next);
    }
    else if (err instanceof (jsonwebtoken_1.JsonWebTokenError || jsonwebtoken_1.TokenExpiredError || jsonwebtoken_1.NotBeforeError) ||
        err.message.includes("jwt expired")) {
        console.log("eloowwwwwwwww");
        return (0, exports.tokenErrorHandler)(err, req, res, next);
    }
    else {
        return (0, exports.generalErrorHandler)(err, req, res, next);
    }
};
exports.errorHandler = errorHandler;
