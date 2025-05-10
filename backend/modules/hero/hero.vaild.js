"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllHeroSchema = exports.getHeroSchema = exports.deleteHeroSchema = exports.updateHeroSchema = exports.addHeroSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const validation_1 = require("../../middleware/validation");
exports.addHeroSchema = {
    body: joi_1.default
        .object({
        title: joi_1.default.string().trim().lowercase().min(3).max(70).required(),
        subtitle: joi_1.default.string().trim().lowercase().min(3).max(150).required(),
        buttonText: joi_1.default.string().trim().lowercase().min(3).max(50).required(),
        buttonLink: joi_1.default.string().trim().lowercase().min(3).max(400).required(),
    })
        .required(),
};
exports.updateHeroSchema = {
    body: joi_1.default
        .object({
        title: joi_1.default.string().trim().lowercase().min(3).max(70).optional(),
        subtitle: joi_1.default.string().trim().lowercase().min(3).max(150).optional(),
        buttonText: joi_1.default.string().trim().lowercase().min(3).max(50).optional(),
        buttonLink: joi_1.default.string().trim().min(3).max(400).optional(),
    })
        .required(),
    params: joi_1.default
        .object({
        id: validation_1.generalFields._id.required(),
    })
        .required(),
};
exports.deleteHeroSchema = {
    params: joi_1.default
        .object({
        id: validation_1.generalFields._id.required(),
    })
        .required(),
};
exports.getHeroSchema = {
    params: joi_1.default
        .object({
        id: validation_1.generalFields._id.required(),
    })
        .required(),
};
exports.getAllHeroSchema = {
    query: joi_1.default
        .object({
        page: validation_1.generalFields.page,
        size: validation_1.generalFields.size,
        search: validation_1.generalFields.search,
        sort: validation_1.generalFields.sort,
        select: validation_1.generalFields.select,
    })
        .required(),
};
