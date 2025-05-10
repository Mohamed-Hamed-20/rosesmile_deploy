"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cokkiesOptions = void 0;
const cokkiesOptions = (maxAge) => {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        priority: "high",
        path: "/",
        maxAge,
    };
};
exports.cokkiesOptions = cokkiesOptions;
