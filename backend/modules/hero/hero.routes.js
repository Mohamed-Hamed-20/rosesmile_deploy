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
const validation_1 = require("../../middleware/validation");
const hero_vaild_1 = require("./hero.vaild");
const errorHandling_1 = require("../../utils/errorHandling");
const heroService = __importStar(require("./service/hero.service"));
const multer_1 = require("../../utils/multer");
const auth_1 = require("../../middleware/auth");
const user_interface_1 = require("../../DB/interfaces/user.interface");
const router = (0, express_1.Router)();
router.post("/", (0, auth_1.isAuth)([user_interface_1.Roles.SuperAdmin]), (0, multer_1.configureMulter)(10 * 1024 * 1024, multer_1.FileType.Images, "uploads").single("image"), (0, validation_1.valid)(hero_vaild_1.addHeroSchema), (0, errorHandling_1.asyncHandler)(heroService.addHero));
router.put("/:id", (0, auth_1.isAuth)([user_interface_1.Roles.SuperAdmin]), (0, multer_1.configureMulter)(10 * 1024 * 1024, multer_1.FileType.Images, "uploads").single("image"), (0, validation_1.valid)(hero_vaild_1.updateHeroSchema), (0, errorHandling_1.asyncHandler)(heroService.updateHero));
router.delete("/:id", (0, auth_1.isAuth)([user_interface_1.Roles.SuperAdmin]), (0, validation_1.valid)(hero_vaild_1.deleteHeroSchema), (0, errorHandling_1.asyncHandler)(heroService.deleteHero));
router.get("/", (0, validation_1.valid)(hero_vaild_1.getAllHeroSchema), (0, errorHandling_1.asyncHandler)(heroService.getAllHero));
router.get("/:id", (0, validation_1.valid)(hero_vaild_1.getHeroSchema), (0, errorHandling_1.asyncHandler)(heroService.getHero));
exports.default = router;
