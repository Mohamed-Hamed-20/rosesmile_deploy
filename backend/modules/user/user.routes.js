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
const user_interface_1 = require("./../../DB/interfaces/user.interface");
const express_1 = require("express");
const validation_1 = require("../../middleware/validation");
const errorHandling_1 = require("../../utils/errorHandling");
const userServices = __importStar(require("./services/user.service"));
const auth_1 = require("../../middleware/auth");
const multer_1 = require("../../utils/multer");
const user_validation_1 = require("./user.validation");
const router = (0, express_1.Router)();
router.get("/profile", (0, auth_1.isAuth)([user_interface_1.Roles.User, user_interface_1.Roles.SuperAdmin, user_interface_1.Roles.Admin]), (0, errorHandling_1.asyncHandler)(userServices.profile));
router.post("/avatar", (0, auth_1.isAuth)([user_interface_1.Roles.Admin, user_interface_1.Roles.SuperAdmin, user_interface_1.Roles.User]), (0, multer_1.configureMulter)().single("avatar"), (0, errorHandling_1.asyncHandler)(userServices.uploadImage));
router.put("/change/password", (0, validation_1.valid)(user_validation_1.changePassSchema), (0, auth_1.isAuth)([user_interface_1.Roles.Admin, user_interface_1.Roles.SuperAdmin, user_interface_1.Roles.User]), (0, errorHandling_1.asyncHandler)(userServices.changePassword));
router.put("/update", (0, validation_1.valid)(user_validation_1.updateSchema), (0, auth_1.isAuth)([user_interface_1.Roles.User, user_interface_1.Roles.SuperAdmin, user_interface_1.Roles.Admin]), (0, errorHandling_1.asyncHandler)(userServices.updateUser));
router.delete("/", (0, auth_1.isAuth)([user_interface_1.Roles.Admin, user_interface_1.Roles.SuperAdmin, user_interface_1.Roles.User]), (0, errorHandling_1.asyncHandler)(userServices.deleteAccount));
router.post("/logout", (0, auth_1.isAuth)([user_interface_1.Roles.Admin, user_interface_1.Roles.SuperAdmin, user_interface_1.Roles.User]), (0, errorHandling_1.asyncHandler)(userServices.logout));
// super admin roles access
router.get("/admin", (0, validation_1.valid)(user_validation_1.getUsersSchema), (0, auth_1.isAuth)([user_interface_1.Roles.SuperAdmin]), (0, errorHandling_1.asyncHandler)(userServices.getallUser));
router.put("/admin/:userId", (0, validation_1.valid)(user_validation_1.updateAdminSchema), (0, auth_1.isAuth)([user_interface_1.Roles.SuperAdmin]), (0, errorHandling_1.asyncHandler)(userServices.updatedUserByAdmin));
router.delete("/admin/:userId", (0, validation_1.valid)(user_validation_1.deleteAccountByAdmin), (0, auth_1.isAuth)([user_interface_1.Roles.Admin, user_interface_1.Roles.SuperAdmin, user_interface_1.Roles.User]), (0, errorHandling_1.asyncHandler)(userServices.deleteAccountByAdmin));
exports.default = router;
