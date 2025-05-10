"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.sendForgetPasswordSchema = exports.cokkiesSchema = exports.confirmEmailSchema = exports.loginSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const validation_1 = require("../../middleware/validation");
// name, email, password, age, phone
exports.registerSchema = {
    body: joi_1.default
        .object({
        firstName: joi_1.default.string().trim().min(3).max(33).required(),
        lastName: joi_1.default.string().trim().min(3).max(33).required(),
        email: validation_1.generalFields.email.required(),
        password: validation_1.generalFields.password.required(),
        confirmPassword: joi_1.default.valid(joi_1.default.ref("password")).required(),
        phone: validation_1.generalFields.phoneNumber.optional(),
    })
        .required(),
};
exports.loginSchema = {
    body: joi_1.default
        .object({
        email: validation_1.generalFields.email.required(),
        password: validation_1.generalFields.password.required(),
    })
        .required(),
};
exports.confirmEmailSchema = {
    params: joi_1.default
        .object({
        token: validation_1.generalFields.token.required(),
    })
        .required(),
};
exports.cokkiesSchema = {
    cookies: joi_1.default
        .object({
        accessToken: joi_1.default
            .string()
            .pattern(/^(Bearer )[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)
            .required(),
        refreshToken: joi_1.default
            .string()
            .pattern(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)
            .required(),
        mp_d7f79c10b89f9fa3026f2fb08d3cf36d_mixpanel: joi_1.default.string(),
    })
        .required(),
};
exports.sendForgetPasswordSchema = {
    body: joi_1.default
        .object({
        email: validation_1.generalFields.email.required(),
    })
        .required(),
};
exports.resetPasswordSchema = {
    body: joi_1.default
        .object({
        newPassword: validation_1.generalFields.password.required(),
        confirmPassword: joi_1.default.string().valid(joi_1.default.ref("newPassword")).required(),
    })
        .required(),
};
