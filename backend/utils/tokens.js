"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandling_1 = require("./errorHandling");
class TokenService {
    constructor(secretKey, expiresIn = "1h") {
        if (!secretKey) {
            throw new errorHandling_1.CustomError("Secret key is missing", 500);
        }
        this.secretKey = secretKey;
        this.expiresIn = expiresIn;
    }
    generateToken(payload) {
        try {
            const token = jsonwebtoken_1.default.sign(payload, this.secretKey, {
                expiresIn: this.expiresIn,
                audience: String(process.env.app_url),
                issuer: String(process.env.companyName),
                subject: String(process.env.Email || "mohamed@gmail.com"),
            });
            if (!token)
                throw new Error("Token generation failed");
            return token;
        }
        catch (error) {
            throw new errorHandling_1.CustomError(`Token generation failed: ${error.message}`, 500);
        }
    }
    verifyToken(token) {
        try {
            const payload = jsonwebtoken_1.default.verify(token, this.secretKey);
            if (!payload) {
                throw new errorHandling_1.CustomError("Token verification failed: Invalid token", 400);
            }
            return payload;
        }
        catch (error) {
            throw process.env.NODE_ENV === "development"
                ? error
                : new errorHandling_1.CustomError("Unknown error occurred during token verification", 500);
        }
    }
}
exports.TokenService = TokenService;
