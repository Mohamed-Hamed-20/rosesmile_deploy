"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.logout = exports.getMe = exports.forgetPassword = exports.sendCode = exports.confirmEmail = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../../../DB/models/user.model"));
const errorHandling_1 = require("../../../utils/errorHandling");
const bcryptjs_1 = __importStar(require("bcryptjs"));
const sanatize_data_1 = require("../../../utils/sanatize.data");
const tokens_1 = require("../../../utils/tokens");
const env_1 = require("../../../config/env");
const Email_servise_1 = require("../../../utils/Email.servise");
const cookies_1 = require("../../../utils/cookies");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crpto_1 = require("../../../utils/crpto");
const html_Templets_1 = require("../../../utils/html.Templets");
const cloudinary_1 = require("../../../utils/cloudinary");
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password, phone } = req.body;
    const chkemail = yield user_model_1.default.findOne({ email }).select("email");
    if (chkemail)
        return next(new errorHandling_1.CustomError("Email is Already Exist", 404));
    const hashpassword = yield bcryptjs_1.default.hash(password, Number(env_1.SALT_ROUND));
    const encryptedPhone = phone
        ? (0, crpto_1.encrypt)(phone, String(process.env.SECRETKEY_CRYPTO))
        : undefined;
    const result = new user_model_1.default({
        firstName,
        lastName,
        email,
        password: hashpassword,
        phone: encryptedPhone,
    });
    const response = yield result.save();
    if (!response)
        return next(new errorHandling_1.CustomError("Something went wrong!", 500));
    const token = new tokens_1.TokenService(String(env_1.TokenConfigration.ACCESS_TOKEN_SECRET), String(env_1.TokenConfigration.ACCESS_EXPIRE)).generateToken({
        userId: response._id,
        role: response.role,
    });
    const link = `${req.protocol}://${req.headers.host}/api/v1/auth/confirm/email/${token}`;
    const emailTemplatePath = path_1.default.join(__dirname, "./emailTemplates/email.html");
    let emailTemplate = fs_1.default.readFileSync(emailTemplatePath, "utf-8");
    emailTemplate = emailTemplate.replace("{{link}}", link);
    yield (0, Email_servise_1.addEmailToQueue)({
        to: response.email,
        subject: "Verify your email",
        text: "Welcome to Rose Smile! 🎉",
        html: emailTemplate,
        message: "Rose Smile",
    });
    return res.status(201).json({
        message: "Please check your email for verification",
        success: true,
        statusCode: 201,
        user: (0, sanatize_data_1.sanatizeUser)(response),
    });
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, password } = req.body;
    const findUser = yield user_model_1.default
        .findOne({ email })
        .select("firstName lastName email password role phone image isConfirmed isBlocked")
        .lean();
    if (!findUser)
        return next(new errorHandling_1.CustomError("Email is not Found , Please Register First ", 404));
    const chkPassword = yield (0, bcryptjs_1.compare)(password, String(findUser.password));
    if (!chkPassword)
        return next(new errorHandling_1.CustomError("Invalid Email or Password", 404));
    if (findUser.isConfirmed == false) {
        return next(new errorHandling_1.CustomError("Please confirm your Email", 400));
    }
    if (findUser.isBlocked == true) {
        return next(new errorHandling_1.CustomError("Your Account is Blocked", 400));
    }
    // access Token
    const accessToken = new tokens_1.TokenService(String(env_1.TokenConfigration.ACCESS_TOKEN_SECRET), String(env_1.TokenConfigration.ACCESS_EXPIRE)).generateToken({
        userId: findUser._id,
        role: findUser.role,
    });
    // Refresh Token
    const refreshToken = new tokens_1.TokenService(String(env_1.TokenConfigration.REFRESH_TOKEN_SECRET), String(env_1.TokenConfigration.REFRESH_EXPIRE)).generateToken({
        userId: findUser._id,
        role: findUser.role,
    });
    res.cookie("accessToken", `${process.env.ACCESS_TOKEN_START_WITH}${accessToken}`, (0, cookies_1.cokkiesOptions)(2 * 24 * 3600000));
    res.cookie("refreshToken", refreshToken, (0, cookies_1.cokkiesOptions)(7 * 24 * 3600000));
    findUser.image = Object.assign(Object.assign({}, findUser.image), (yield cloudinary_1.cloudinaryInstance.imageVersions((_a = findUser.image) === null || _a === void 0 ? void 0 : _a.id)));
    return res.status(200).json({
        message: "Login successful",
        success: true,
        statusCode: 200,
        user: (0, sanatize_data_1.sanatizeUser)(findUser),
    });
});
exports.login = login;
const confirmEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const { userId } = new tokens_1.TokenService(String(env_1.TokenConfigration.ACCESS_TOKEN_SECRET)).verifyToken(token);
        if (!userId) {
            return res.sendFile(path_1.default.join(__dirname, "./emailTemplates/email-failed.html"));
        }
        const user = yield user_model_1.default.findById(userId).select("isConfirmed");
        if (!user) {
            return res.sendFile(path_1.default.join(__dirname, "./emailTemplates/email-failed.html"));
        }
        // If the email is already confirmed
        if (user.isConfirmed) {
            return res.redirect("http://localhost:5173/login");
        }
        const updateUser = yield user_model_1.default
            .findByIdAndUpdate(userId, { $set: { isConfirmed: true } }, { new: true })
            .select("firstName lastName email isConfirmed role")
            .lean();
        if (!updateUser) {
            return res.sendFile(path_1.default.join(__dirname, "./emailTemplates/email-failed.html"));
        }
        return res.sendFile(path_1.default.join(__dirname, "./emailTemplates/email-success.html"));
    }
    catch (error) {
        res.status(500).json({
            message: "catch error",
            error: error.message,
            stack: error.stack,
        });
    }
});
exports.confirmEmail = confirmEmail;
const sendCode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    // Check if the user exists
    const user = yield user_model_1.default.findOne({ email });
    if (!user) {
        return res
            .status(404)
            .json({ message: "Email not found. Please register first." });
    }
    const resetToken = new tokens_1.TokenService(env_1.TokenConfigration.ACCESS_TOKEN_SECRET, "10m").generateToken({
        userId: user._id,
    });
    // reset URL
    const resetUrl = `http://localhost:5173/ResetPassword/${resetToken}`;
    //  Send reset link via email
    yield (0, Email_servise_1.addEmailToQueue)({
        to: user === null || user === void 0 ? void 0 : user.email,
        subject: "Reset your email",
        text: "Welcome to Rose Smile! 🎉",
        html: new html_Templets_1.HtmlTemplets("").resetPasswordEmailTemplate(resetUrl, `${user.firstName} ${user.lastName}`),
        message: "Rose Smile !",
    });
    return res
        .status(200)
        .json({ message: "Password reset link sent! Check your email." });
});
exports.sendCode = sendCode;
const forgetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const { newPassword } = req.body;
    const rounds = Number(env_1.SALT_ROUND) || 8;
    // Verify the token
    const decoded = new tokens_1.TokenService(env_1.TokenConfigration.ACCESS_TOKEN_SECRET).verifyToken(token);
    if (!decoded) {
        return next(new errorHandling_1.CustomError("Invalid to decode", 400));
    }
    const user = yield user_model_1.default.findById(decoded.userId);
    if (!user) {
        return res
            .status(400)
            .json({ message: "Invalid token or user does not exist." });
    }
    // Hash new password
    const hashedPassword = bcryptjs_1.default.hashSync(newPassword, rounds);
    // Update the password
    user.password = hashedPassword;
    const updatedUser = yield user_model_1.default.findByIdAndUpdate({ _id: decoded.userId }, { password: hashedPassword }, { new: true });
    return res
        .status(200)
        .json({ message: "✅ Password reset successful! You can log in now." });
});
exports.forgetPassword = forgetPassword;
const getMe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const token = (_b = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken) === null || _b === void 0 ? void 0 : _b.replace(/^Bearer\s?/, "");
        if (!token)
            return res.status(401).json({ message: "No token provided" });
        if (!env_1.TokenConfigration.ACCESS_TOKEN_SECRET) {
            return res
                .status(500)
                .json({ message: "Server misconfiguration: missing token secret" });
        }
        const decoded = new tokens_1.TokenService(env_1.TokenConfigration.ACCESS_TOKEN_SECRET).verifyToken(token);
        if (!(decoded === null || decoded === void 0 ? void 0 : decoded.userId))
            return res.status(401).json({ message: "Invalid token" });
        const user = yield user_model_1.default
            .findById(decoded.userId)
            .select("firstName lastName email role");
        if (!user)
            return res.status(401).json({ message: "User not found" });
        return res.status(200).json({ user });
    }
    catch (err) {
        return res
            .status(401)
            .json({ message: "Unauthorized", error: err.message });
    }
});
exports.getMe = getMe;
// after
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("accessToken", (0, cookies_1.cokkiesOptions)(0));
    res.clearCookie("refreshToken", (0, cookies_1.cokkiesOptions)(0));
    res.status(200).json({ message: "Logged out successfully" });
});
exports.logout = logout;
