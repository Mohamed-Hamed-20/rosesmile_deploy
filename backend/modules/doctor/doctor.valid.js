"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCaseSchema = exports.DoctorIdSchema = exports.updateDoctorSchema = exports.addDoctorSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.addDoctorSchema = {
    body: joi_1.default.object({
        name: joi_1.default.string().required(),
        specialization: joi_1.default.string().required(),
        description: joi_1.default
            .alternatives()
            .try(joi_1.default.string().min(3).max(300).required(), joi_1.default.array().items(joi_1.default.string().min(3).max(300).required()))
            .required()
            .custom((value) => [].concat(value), "Convert single value to array"),
    }),
};
exports.updateDoctorSchema = {
    body: joi_1.default.object({
        name: joi_1.default.string().optional(),
        specialization: joi_1.default.string().optional(),
        description: joi_1.default.array().items(joi_1.default.string().min(3).max(300).optional()).optional(),
    }),
    params: joi_1.default.object({
        doctorId: joi_1.default.string().required(),
    }),
};
exports.DoctorIdSchema = {
    params: joi_1.default.object({
        doctorId: joi_1.default.string().required(),
    }),
};
exports.deleteCaseSchema = {
    body: joi_1.default.object({
        caseId: joi_1.default.string().required(),
    }),
    params: joi_1.default.object({
        doctorId: joi_1.default.string().required(),
    }),
};
