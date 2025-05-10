"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSheetSchema = exports.updateSheetSchema = exports.createSheetSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createSheetSchema = {
    body: joi_1.default.object({
        title: joi_1.default.string().required(),
        url: joi_1.default.string().required(),
    }),
};
exports.updateSheetSchema = {
    params: joi_1.default.object({
        sheetId: joi_1.default.string().required(),
    }),
    body: joi_1.default.object({
        title: joi_1.default.string(),
        url: joi_1.default.string(),
    }),
};
exports.deleteSheetSchema = {
    params: joi_1.default.object({
        id: joi_1.default.string().required(),
    }),
};
