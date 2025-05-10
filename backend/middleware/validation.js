"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalFields = exports.customMessages = exports.toLowerCase = exports.validatePhoneNumber = exports.valid = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = require("mongoose");
const google_libphonenumber_1 = require("google-libphonenumber");
const req_FE = ["body", "params", "query", "headers", "cookies"];
const valid = (schema) => {
    return (req, res, next) => {
        const validationErrors = [];
        req_FE.forEach((key) => {
            if (schema[key]) {
                const { error, value } = schema[key].validate(req[key], {
                    abortEarly: false,
                });
                if (error) {
                    error.details.forEach((errorDetail) => {
                        var _a, _b;
                        validationErrors.push({
                            message: errorDetail.message.replace(/\"/g, ""),
                            path: ((_a = errorDetail.path) === null || _a === void 0 ? void 0 : _a[0]) || key,
                            label: (_b = errorDetail.context) === null || _b === void 0 ? void 0 : _b.label,
                            type: errorDetail.type,
                        });
                    });
                }
                else {
                    req[key] = value;
                }
            }
        });
        if (validationErrors.length > 0) {
            return res.status(400).json({
                message: validationErrors[0].message,
                errors: validationErrors,
            });
        }
        next();
    };
};
exports.valid = valid;
//============================= validateObjectId =====================
const validateObjectId = (value, helper) => {
    return (0, mongoose_1.isValidObjectId)(value) ? value : helper.message("Invalid {#label}");
};
//=============================== Validation for phone number =====================
const validatePhoneNumber = (value, helper) => {
    try {
        const phoneUtil = google_libphonenumber_1.PhoneNumberUtil.getInstance();
        const number = phoneUtil.parse(value);
        const isValid = phoneUtil.isValidNumber(number);
        return isValid ? value : helper.message("Invalid phone number format");
    }
    catch (error) {
        return helper.message("Invalid phone number format");
    }
};
exports.validatePhoneNumber = validatePhoneNumber;
//============================= Custom Transform Functions =====================
const toLowerCase = (value) => value.toLowerCase();
exports.toLowerCase = toLowerCase;
//============================= Custom Error Messages =====================
exports.customMessages = {
    "string.base": "{#label} must be a string",
    "string.min": "{#label} must be at least {#limit} characters",
    "string.max": "{#label} must be at most {#limit} characters",
    "number.base": "{#label} must be a number",
    "number.valid": "{#label} must be one of {#valids}",
    "boolean.base": "{#label} must be true or false",
    "array.base": "{#label} must be an array",
    "array.items": "Invalid item in {#label}",
    "_id.required": "{#label} is required",
    "_id.optional": "{#label} is optional",
    "any.only": "{#label} must be {#valids}",
    "any.required": "{#label} is required",
};
//====================== General Validation Fields =========================
exports.generalFields = {
    email: joi_1.default
        .string()
        .email({ tlds: { allow: ["com", "net", "org", "pro", "eg", "sa"] } })
        .trim()
        .messages(exports.customMessages),
    password: joi_1.default
        .string()
        .pattern(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/)
        .trim()
        .min(8)
        .max(44)
        .messages(Object.assign({ "string.pattern.base": "Password must be at least 8 characters, contain numbers, uppercase letters, and symbols." }, exports.customMessages)),
    _id: joi_1.default.string().trim().custom(validateObjectId).messages(exports.customMessages),
    phoneNumber: joi_1.default
        .string()
        .trim()
        .custom(exports.validatePhoneNumber)
        .messages(exports.customMessages),
    gender: joi_1.default
        .string()
        .valid("male", "female")
        .lowercase()
        .trim()
        .messages(exports.customMessages),
    date: joi_1.default.date().iso().messages(exports.customMessages),
    sort: joi_1.default.string().trim().optional().messages(exports.customMessages),
    select: joi_1.default
        .string()
        .trim()
        .min(3)
        .max(100)
        .optional()
        .messages(exports.customMessages),
    page: joi_1.default.number().min(0).max(33).optional().messages(exports.customMessages),
    size: joi_1.default.number().min(0).max(23).optional().messages(exports.customMessages),
    search: joi_1.default.string().trim().min(0).max(100).messages(exports.customMessages),
    file: joi_1.default.object({
        size: joi_1.default.number(),
    }),
    token: joi_1.default
        .string()
        .pattern(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)
        .messages(exports.customMessages),
    title: joi_1.default
        .string()
        .trim()
        .lowercase()
        .min(3)
        .max(100)
        .messages(exports.customMessages),
    desc: joi_1.default
        .string()
        .trim()
        .lowercase()
        .min(3)
        .max(700)
        .messages(exports.customMessages),
};
