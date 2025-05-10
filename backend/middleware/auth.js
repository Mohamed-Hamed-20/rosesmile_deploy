"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const errorHandling_1 = require("../utils/errorHandling");
const tokens_1 = require("../utils/tokens");
const user_model_1 = __importDefault(require("../DB/models/user.model"));
const mongoose_1 = require("mongoose");
const env_1 = require("../config/env");
const cookies_1 = require("../utils/cookies");
const jsonwebtoken_1 = require("jsonwebtoken");
const isAuth = (roles) => {
    return (0, errorHandling_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        console.time("⏱️ isAuth");
        try {
            const { accessToken: accessTokenPrefix, refreshToken } = req.cookies;
            if (!accessTokenPrefix || !refreshToken) {
                return next(new errorHandling_1.CustomError("Plz login first", 401));
            }
            const accessToken = accessTokenPrefix.startsWith(env_1.TokenConfigration.ACCESS_TOKEN_START_WITH || "Bearer ")
                ? accessTokenPrefix.split(env_1.TokenConfigration.ACCESS_TOKEN_START_WITH || "Bearer ")[1]
                : accessTokenPrefix;
            let decodedToken;
            try {
                decodedToken = new tokens_1.TokenService(env_1.TokenConfigration.ACCESS_TOKEN_SECRET).verifyToken(accessToken);
            }
            catch (error) {
                if (!(error instanceof jsonwebtoken_1.TokenExpiredError)) {
                    return next(error);
                }
            }
            if (decodedToken) {
                const { userId } = decodedToken;
                const user = yield user_model_1.default.findById(new mongoose_1.Types.ObjectId(userId), {
                    __v: 0,
                });
                if (!user || !user.role) {
                    return next(new errorHandling_1.CustomError("User not found", 404));
                }
                if (user.isBlocked === true) {
                    return next(new errorHandling_1.CustomError("your account has been blocked contact with owner to enable your account again", 404));
                }
                if (!roles.includes(user.role)) {
                    return next(new errorHandling_1.CustomError("Unauthorized user", 403));
                }
                req.user = user;
                console.timeEnd("⏱️ isAuth");
                return next();
            }
            // Handle expired access token: Use refresh token
            if (!refreshToken) {
                return next(new errorHandling_1.CustomError("Refresh token is required", 401));
            }
            let decodedRefresh;
            try {
                decodedRefresh = new tokens_1.TokenService(String(env_1.TokenConfigration.REFRESH_TOKEN_SECRET)).verifyToken(refreshToken);
            }
            catch (error) {
                return next(new errorHandling_1.CustomError("Invalid refresh token", 400));
            }
            if (!decodedRefresh || !decodedRefresh.userId) {
                return next(new errorHandling_1.CustomError("Invalid refresh token", 400));
            }
            const user = yield user_model_1.default.findById(decodedRefresh.userId).lean();
            if (!user) {
                return next(new errorHandling_1.CustomError("User not found, please login again", 400));
            }
            if (user.isBlocked === true) {
                return next(new errorHandling_1.CustomError("your account has been blocked contact with owner to enable your account again", 404));
            }
            // Generate new tokens
            const newAccessToken = new tokens_1.TokenService(String(env_1.TokenConfigration.ACCESS_TOKEN_SECRET), String(env_1.TokenConfigration.ACCESS_EXPIRE)).generateToken({ userId: user._id, role: user.role });
            const newRefreshToken = new tokens_1.TokenService(String(env_1.TokenConfigration.REFRESH_TOKEN_SECRET), String(env_1.TokenConfigration.REFRESH_EXPIRE)).generateToken({ userId: user._id, role: user.role });
            // Set new tokens in cookies
            res.cookie("accessToken", `${env_1.TokenConfigration.ACCESS_TOKEN_START_WITH || "Bearer "}${newAccessToken}`, (0, cookies_1.cokkiesOptions)(10 * 24 * 3600000) // 10 days
            );
            res.cookie("refreshToken", newRefreshToken, (0, cookies_1.cokkiesOptions)(10 * 24 * 3600000));
            req.user = user;
            return next();
        }
        catch (error) {
            return next(error);
        }
    }));
};
exports.isAuth = isAuth;
