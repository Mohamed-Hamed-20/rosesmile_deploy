"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFormSchema = exports.addCommentSchema = exports.addFormSchema = void 0;
const validation_1 = require("./../../middleware/validation");
const joi_1 = __importDefault(require("joi"));
exports.addFormSchema = {
    body: joi_1.default.object({
        name: joi_1.default.string().required(),
        phone: joi_1.default.string().required(),
        section: validation_1.generalFields._id.required(),
        service: validation_1.generalFields._id,
        city: joi_1.default.string().required(),
        spreadsheetId: joi_1.default.string().required(),
    }),
};
exports.addCommentSchema = {
    body: joi_1.default.object({
        comment: joi_1.default.string(),
        status: joi_1.default.string().valid("pending", "absent", "completed"),
    }),
    params: joi_1.default.object({
        id: joi_1.default.string().required(),
    }),
};
exports.updateFormSchema = {
    body: joi_1.default.object({
        name: joi_1.default.string().optional(),
        phone: joi_1.default.string().optional(),
        service: joi_1.default.string().optional(),
        city: joi_1.default.string().optional(),
        comment: joi_1.default.string().optional(),
        status: joi_1.default.string().valid("pending", "absent", "completed").optional(),
    }),
    params: joi_1.default.object({
        id: joi_1.default.string().required(),
    }),
};
