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
const errorHandling_1 = require("./../../utils/errorHandling");
const express_1 = require("express");
const validation_1 = require("../../middleware/validation");
const news_valid_1 = require("./news.valid");
const newsService = __importStar(require("./services/news.service"));
const multer_1 = require("../../utils/multer");
const router = (0, express_1.Router)();
//create news
router.post("/", (0, multer_1.configureMulter)().single("image"), (0, validation_1.valid)(news_valid_1.addNewsSchema), (0, errorHandling_1.asyncHandler)(newsService.createNews));
//update news
router.put("/:id", (0, validation_1.valid)(news_valid_1.updateNewsSchema), (0, errorHandling_1.asyncHandler)(newsService.updateNews));
//update news image
router.put("/:id/image", (0, multer_1.configureMulter)().single("image"), (0, validation_1.valid)(news_valid_1.deleteNewsSchema), (0, errorHandling_1.asyncHandler)(newsService.updateNewsImage));
//delete news
router.delete("/:id", (0, validation_1.valid)(news_valid_1.deleteNewsSchema), (0, errorHandling_1.asyncHandler)(newsService.deleteNews));
//get news
router.get("/", (0, validation_1.valid)(news_valid_1.getNewsSchema), (0, errorHandling_1.asyncHandler)(newsService.getNews));
//get news by id
router.get("/:id", (0, validation_1.valid)(news_valid_1.deleteNewsSchema), (0, errorHandling_1.asyncHandler)(newsService.getNewsById));
exports.default = router;
