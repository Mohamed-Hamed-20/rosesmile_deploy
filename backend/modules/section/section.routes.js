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
const sectionService = __importStar(require("./service/section.service"));
const multer_1 = require("../../utils/multer");
const errorHandling_1 = require("../../utils/errorHandling");
const section_vaild_1 = require("./section.vaild");
const auth_1 = require("../../middleware/auth");
const user_interface_1 = require("../../DB/interfaces/user.interface");
const router = (0, express_1.Router)();
router.post("/add", (0, auth_1.isAuth)([user_interface_1.Roles.SuperAdmin]), (0, multer_1.configureMulter)().single("image"), (0, validation_1.valid)(section_vaild_1.addsectionSchema), (0, errorHandling_1.asyncHandler)(sectionService.addsection));
router.patch("/update", (0, auth_1.isAuth)([user_interface_1.Roles.SuperAdmin]), (0, multer_1.configureMulter)().single("image"), (0, validation_1.valid)(section_vaild_1.updatesectionSchema), (0, errorHandling_1.asyncHandler)(sectionService.updatesection));
// get section By Id
router.get("/:id", (0, validation_1.valid)(section_vaild_1.sectionIdSchema), (0, errorHandling_1.asyncHandler)(sectionService.getsectionById));
// search section
router.get("/", (0, validation_1.valid)(section_vaild_1.searchSchema), (0, errorHandling_1.asyncHandler)(sectionService.searchsection));
// delete section
router.delete("/:id", (0, validation_1.valid)(section_vaild_1.sectionIdSchema), (0, auth_1.isAuth)([user_interface_1.Roles.SuperAdmin]), (0, errorHandling_1.asyncHandler)(sectionService.deletesection));
exports.default = router;
