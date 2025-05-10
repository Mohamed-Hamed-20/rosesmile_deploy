"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanatizeUser = void 0;
const crpto_1 = require("./crpto");
const lodash_1 = __importDefault(require("lodash"));
const sanatizeUser = (user) => {
    const sanitized = {
        _id: user === null || user === void 0 ? void 0 : user._id,
        firstName: user === null || user === void 0 ? void 0 : user.firstName,
        lastName: user === null || user === void 0 ? void 0 : user.lastName,
        email: user === null || user === void 0 ? void 0 : user.email,
        phone: (user === null || user === void 0 ? void 0 : user.phone)
            ? (0, crpto_1.decrypt)(String(user === null || user === void 0 ? void 0 : user.phone), String(process.env.SECRETKEY_CRYPTO))
            : undefined,
        role: user === null || user === void 0 ? void 0 : user.role,
        image: user === null || user === void 0 ? void 0 : user.image,
    };
    return lodash_1.default.omitBy(sanitized, lodash_1.default.isNil);
};
exports.sanatizeUser = sanatizeUser;
