"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteServiceImageSchema = exports.updateServiceImageSchema = exports.addServiceImagesSchema = exports.getServicesSchema = exports.getServiceByIdSchema = exports.deleteServiceSchema = exports.updateServiceSchema = exports.addServiceSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const validation_1 = require("../../middleware/validation");
exports.addServiceSchema = {
    body: joi_1.default.object({
        title: joi_1.default.string().required(),
        subTitle: joi_1.default.string().trim().lowercase().min(3).max(300).optional(),
        description: joi_1.default
            .alternatives()
            .try(joi_1.default.string().min(3).max(300).required(), joi_1.default.array().items(joi_1.default.string().min(3).max(300).required()))
            .required()
            .custom((value) => [].concat(value), "Convert single value to array"),
        features: joi_1.default
            .alternatives()
            .try(joi_1.default.string().min(3).max(300).required(), joi_1.default.array().items(joi_1.default.string().min(3).max(300).required()))
            .required()
            .custom((value) => [].concat(value), "Convert single value to array"),
        sectionId: validation_1.generalFields._id.required(),
    }),
};
exports.updateServiceSchema = {
    body: joi_1.default.object({
        title: joi_1.default.string().trim().min(1).max(2000).optional(),
        subTitle: joi_1.default.string().trim().lowercase().min(3).max(300).optional(),
        description: joi_1.default
            .array()
            .items(joi_1.default.string().min(3).max(300).optional())
            .optional(),
        features: joi_1.default
            .array()
            .items(joi_1.default.string().min(3).max(300).optional())
            .optional(),
        sectionId: validation_1.generalFields._id,
    }),
    params: joi_1.default.object({
        id: joi_1.default.string().required(),
    }),
};
exports.deleteServiceSchema = {
    params: joi_1.default.object({
        id: joi_1.default.string().required(),
    }),
};
exports.getServiceByIdSchema = {
    params: joi_1.default.object({
        id: joi_1.default.string().required(),
    }),
};
exports.getServicesSchema = {
    query: joi_1.default.object({
        page: validation_1.generalFields.page,
        size: validation_1.generalFields.size,
        sort: validation_1.generalFields.sort,
        search: validation_1.generalFields.search,
        select: validation_1.generalFields.select,
        id: validation_1.generalFields._id,
        sectionIds: joi_1.default
            .alternatives()
            .try(validation_1.generalFields._id, joi_1.default.array().items(validation_1.generalFields._id))
            .optional()
            .custom((value) => [].concat(value), "Convert single value to array"),
    }),
};
exports.addServiceImagesSchema = {
    params: joi_1.default.object({
        id: joi_1.default.string().required(),
    }),
};
exports.updateServiceImageSchema = {
    params: joi_1.default.object({
        id: validation_1.generalFields._id.required(),
    }),
};
exports.deleteServiceImageSchema = {
    params: joi_1.default.object({
        id: joi_1.default.string().required(),
    }),
    body: joi_1.default.object({
        imageIds: joi_1.default.array().items(joi_1.default.string()).required(),
    }),
};
