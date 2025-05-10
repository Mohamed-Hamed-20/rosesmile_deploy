"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authServices = __importStar(require("./services/auth.service"));
const auth_validation_1 = require("./auth.validation");
const validation_1 = require("../../middleware/validation");
const errorHandling_1 = require("../../utils/errorHandling");
const router = (0, express_1.Router)();
router.post("/register", (0, validation_1.valid)(auth_validation_1.registerSchema), (0, errorHandling_1.asyncHandler)(authServices.register));
router.post("/login", (0, validation_1.valid)(auth_validation_1.loginSchema), (0, errorHandling_1.asyncHandler)(authServices.login));
router.get("/confirm/email/:token", (0, validation_1.valid)(auth_validation_1.confirmEmailSchema), (0, errorHandling_1.asyncHandler)(authServices.confirmEmail));
router.post("/reset/:token", (0, validation_1.valid)(auth_validation_1.resetPasswordSchema), (0, errorHandling_1.asyncHandler)(authServices.forgetPassword));
router.post("/sendCode", (0, validation_1.valid)(auth_validation_1.sendForgetPasswordSchema), (0, errorHandling_1.asyncHandler)(authServices.sendCode));
//  routes to handle login and logout in the frontend
router.get("/me", (0, errorHandling_1.asyncHandler)(authServices.getMe));
router.get("/logout", (0, errorHandling_1.asyncHandler)(authServices.logout));
exports.default = router;
