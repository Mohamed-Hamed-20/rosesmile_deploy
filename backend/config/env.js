"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GOOGLE_SHEET = exports.CLOUDINARYOPTIONS = exports.CLOUDINARY = exports.REDIS = exports.AWS_S3Keys = exports.SALT_ROUND = exports.FRONTEND = exports.EmailSendConfigration = exports.TokenConfigration = exports.ApiDocumentation = exports.PORT = exports.NODE_ENV = exports.databaseConfigration = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.databaseConfigration = {
    DB_URL: process.env.DB_URL || "mongodb://localhost:27017/app",
};
exports.NODE_ENV = process.env.NODE_ENV || "development";
exports.PORT = Number(process.env.PORT) || 5000;
exports.ApiDocumentation = process.env.ApiDocumentation || "https://www.youtube.com/watch?v=tpv35Uia4tc";
exports.TokenConfigration = {
    ACCESS_TOKEN_START_WITH: process.env.ACCESS_TOKEN_START_WITH,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_EXPIRE: process.env.ACCESS_EXPIRE,
    REFRESH_EXPIRE: process.env.REFRESH_EXPIRE,
};
exports.EmailSendConfigration = {
    EMAIL: process.env.EMAIL,
    PASSWORD: process.env.PASSWORD,
};
exports.FRONTEND = {
    RESET_PASSWORD_URL: process.env.RESET_PASSWORD_URL,
    BASE_URL: process.env.BASE_URL,
    CONFIRM_EMAIL: process.env.CONFIRM_EMAIL,
};
exports.SALT_ROUND = process.env.SALT_ROUND;
exports.AWS_S3Keys = {
    BUCKET_NAME: process.env.BUCKET_NAME,
    REGION: process.env.REGION,
    ENDPOINT_URL: process.env.ENDPOINT_URL,
    ACCESS_KEY: process.env.ACCESS_KEY,
    SECRET_KEY: process.env.SECRET_KEY,
};
exports.REDIS = {
    HOST: process.env.REDIS_HOST,
    PORT: Number(process.env.REDIS_PORT),
};
exports.CLOUDINARY = {
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    API_KEY: process.env.CLOUDINARY_API_KEY,
    API_SECRET: process.env.CLOUDINARY_API_SECRET,
};
exports.CLOUDINARYOPTIONS = {
    backgroundLarge: {
        width: 1920,
        height: 1080,
        crop: "fill",
        quality: "auto:best",
        format: "auto",
        flags: "progressive",
    },
    heroBanner: {
        width: 1280,
        height: 720,
        crop: "limit",
        quality: "auto:good",
        format: "auto",
        flags: "progressive",
        effect: "improve",
    },
    thumbnailSmall: {
        width: 150,
        height: 100,
        crop: "thumb",
        quality: "auto:low",
        format: "auto",
        flags: "progressive",
    },
    thumbnailMedium: {
        width: 300,
        height: 200,
        crop: "limit",
        quality: "auto:eco",
        format: "auto",
        flags: "progressive",
    },
    logoSmall: {
        width: 100,
        height: 100,
        crop: "thumb",
        quality: "auto:low",
        format: "auto",
        gravity: "face",
        radius: "max",
    },
    socialIcon: {
        width: 32,
        height: 32,
        crop: "thumb",
        quality: "auto:low",
        format: "auto",
        gravity: "face",
        radius: "max",
    },
    profilePicture: {
        width: 400,
        height: 400,
        crop: "fill",
        quality: "auto:good",
        format: "auto",
        gravity: "face",
        radius: "max",
    },
    cardImage: {
        width: 600,
        height: 400,
        crop: "limit",
        quality: "auto:eco",
        format: "auto",
        flags: "progressive",
    },
};
exports.GOOGLE_SHEET = {
    CLIENT_EMAIL: process.env.GOOGLE_SHEET_CLIENT_EMAIL,
    PRIVATE_KEY: (_a = process.env.GOOGLE_SHEET_PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, "\n"),
};
