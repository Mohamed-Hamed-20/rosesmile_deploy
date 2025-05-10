"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOffersSchema = exports.getOfferByIdSchema = exports.deleteOfferSchema = exports.updateOfferImageSchema = exports.updateOfferSchema = exports.createOfferSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const validation_1 = require("../../middleware/validation");
exports.createOfferSchema = {
    body: joi_1.default
        .object({
        title: joi_1.default.string().trim().min(3).max(1000).required(),
        desc: joi_1.default.string().trim().min(3).max(7000).required(),
        type: joi_1.default.string().valid("section", "service").required(),
        reference: validation_1.generalFields._id.required(),
        display: joi_1.default.boolean().required(),
    })
        .required(),
};
exports.updateOfferSchema = {
    body: joi_1.default.object({
        title: joi_1.default.string().trim().min(3).max(1000).optional(),
        desc: joi_1.default.string().trim().min(3).max(7000).optional(),
        type: joi_1.default.string().valid("section", "service").optional(),
        reference: validation_1.generalFields._id.optional(),
        display: joi_1.default.boolean().optional(),
    }),
    params: joi_1.default.object({
        id: validation_1.generalFields._id.required(),
    }),
};
exports.updateOfferImageSchema = {
    params: joi_1.default.object({
        id: validation_1.generalFields._id.required(),
    }),
};
exports.deleteOfferSchema = {
    params: joi_1.default.object({
        id: validation_1.generalFields._id.required(),
    }),
};
exports.getOfferByIdSchema = {
    params: joi_1.default.object({
        id: validation_1.generalFields._id.required(),
    }),
};
exports.getOffersSchema = {
    query: joi_1.default.object({
        page: validation_1.generalFields.page,
        size: validation_1.generalFields.size,
        search: validation_1.generalFields.search,
        sort: validation_1.generalFields.sort,
        select: validation_1.generalFields.select,
        display: joi_1.default.string().valid("yes", "no").optional(),
    }),
};
