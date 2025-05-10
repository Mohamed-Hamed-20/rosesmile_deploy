"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewsSchema = exports.deleteNewsSchema = exports.updateNewsSchema = exports.addNewsSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const validation_1 = require("../../middleware/validation");
exports.addNewsSchema = {
    body: joi_1.default.object({
        title: joi_1.default.string().trim().min(3).max(300).required(),
        subTitle: joi_1.default.string().trim().lowercase().min(3).max(300).required(),
        desc: joi_1.default
            .alternatives()
            .try(joi_1.default.string().min(3).max(500).required(), joi_1.default.array().items(joi_1.default.string().min(3).max(500).required()))
            .required()
            .custom((value) => [].concat(value), "Convert single value to array"),
        serviceId: validation_1.generalFields._id.required(),
    }),
};
exports.updateNewsSchema = {
    body: joi_1.default.object({
        title: joi_1.default.string().required(),
        subTitle: joi_1.default.string().trim().lowercase().min(3).max(300).optional(),
        desc: joi_1.default.array().items(joi_1.default.string().min(3).max(500).optional()).optional(),
        serviceId: validation_1.generalFields._id.optional(),
    }),
    params: joi_1.default.object({
        id: validation_1.generalFields._id.required(),
    }),
};
exports.deleteNewsSchema = {
    params: joi_1.default.object({
        id: validation_1.generalFields._id.required(),
    }),
};
exports.getNewsSchema = {
    query: joi_1.default.object({
        page: joi_1.default.number().optional(),
        size: joi_1.default.number().optional(),
        search: joi_1.default.string().optional(),
        select: joi_1.default.string().optional(),
        sort: joi_1.default.string().optional(),
        serviceIds: joi_1.default.array().items(validation_1.generalFields._id).optional(),
    }),
};
