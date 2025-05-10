"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccountByAdmin = exports.updateAdminSchema = exports.getUsersSchema = exports.changePassSchema = exports.updateSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const validation_1 = require("../../middleware/validation");
const user_interface_1 = require("../../DB/interfaces/user.interface");
exports.updateSchema = {
    body: joi_1.default
        .object({
        firstName: joi_1.default.string().trim().min(3).max(33).optional(),
        lastName: joi_1.default.string().trim().min(3).max(33).optional(),
        phone: validation_1.generalFields.phoneNumber.optional(),
    })
        .required(),
};
exports.changePassSchema = {
    body: joi_1.default
        .object({
        currentPassword: validation_1.generalFields.password.required(),
        newPassword: validation_1.generalFields.password.required(),
        confirmPassword: joi_1.default.string().valid(joi_1.default.ref("newPassword")).required(),
    })
        .required(),
};
exports.getUsersSchema = {
    query: joi_1.default.object({
        page: validation_1.generalFields.page,
        size: validation_1.generalFields.size,
        sort: validation_1.generalFields.sort,
        search: validation_1.generalFields.search,
        select: validation_1.generalFields.select,
        role: joi_1.default
            .string()
            .valid(user_interface_1.Roles.User, user_interface_1.Roles.Admin, user_interface_1.Roles.SuperAdmin)
            .optional(),
        blocked: joi_1.default.string().valid("yes", "no").optional(),
        confirmed: joi_1.default.string().valid("yes", "no").optional(),
    }),
};
exports.updateAdminSchema = {
    body: joi_1.default
        .object({
        role: joi_1.default
            .string()
            .valid(user_interface_1.Roles.User, user_interface_1.Roles.Admin, user_interface_1.Roles.SuperAdmin)
            .optional(),
        block: joi_1.default.string().valid("yes", "no").optional(),
        confirm: joi_1.default.string().valid("yes", "no").optional(),
    })
        .required(),
    params: joi_1.default
        .object({
        userId: validation_1.generalFields._id.required(),
    })
        .required(),
};
exports.deleteAccountByAdmin = {
    params: joi_1.default
        .object({
        userId: validation_1.generalFields._id.required(),
    })
        .required(),
};
