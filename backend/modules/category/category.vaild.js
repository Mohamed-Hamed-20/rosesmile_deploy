"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchSchema = exports.sectionIdSchema = exports.updatesectionSchema = exports.addsectionSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const validation_1 = require("../../middleware/validation");
exports.addsectionSchema = {
    body: joi_1.default
        .object({
        title: validation_1.generalFields.title.required(),
        desc: validation_1.generalFields.desc.required(),
    })
        .required(),
};
exports.updatesectionSchema = {
    body: joi_1.default
        .object({
        title: validation_1.generalFields.title.optional(),
        desc: validation_1.generalFields.desc.optional(),
    })
        .required(),
    query: joi_1.default
        .object({
        sectionId: validation_1.generalFields._id.required(),
    })
        .required(),
};
exports.sectionIdSchema = {
    params: joi_1.default
        .object({
        id: validation_1.generalFields._id.required(),
    })
        .required(),
};
exports.searchSchema = {
    query: joi_1.default
        .object({
        page: validation_1.generalFields.page,
        size: validation_1.generalFields.size,
        select: validation_1.generalFields.select,
        search: validation_1.generalFields.search,
        sort: validation_1.generalFields.sort,
    })
        .required(),
};
