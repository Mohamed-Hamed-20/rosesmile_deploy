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
const offersService = __importStar(require("./service/offers.service"));
const errorHandling_1 = require("../../utils/errorHandling");
const auth_1 = require("../../middleware/auth");
const user_interface_1 = require("../../DB/interfaces/user.interface");
const validation_1 = require("../../middleware/validation");
const offer_vaild_1 = require("./offer.vaild");
const multer_1 = require("../../utils/multer");
const router = (0, express_1.Router)();
//create offer
router.post("/", (0, multer_1.configureMulter)().single("image"), (0, validation_1.valid)(offer_vaild_1.createOfferSchema), (0, auth_1.isAuth)([user_interface_1.Roles.SuperAdmin]), (0, errorHandling_1.asyncHandler)(offersService.createOffer));
//get all offers
router.get("/", (0, validation_1.valid)(offer_vaild_1.getOffersSchema), (0, errorHandling_1.asyncHandler)(offersService.getOffers));
//get offer by id
router.get("/:id", (0, validation_1.valid)(offer_vaild_1.getOfferByIdSchema), (0, errorHandling_1.asyncHandler)(offersService.getOfferById));
//update offer
router.put("/:id", (0, validation_1.valid)(offer_vaild_1.updateOfferSchema), (0, auth_1.isAuth)([user_interface_1.Roles.SuperAdmin]), (0, errorHandling_1.asyncHandler)(offersService.updateOffer));
//update offer image
router.put("/image/:id", (0, multer_1.configureMulter)(1024 * 1024 * 7, multer_1.FileType.Images).single("image"), (0, validation_1.valid)(offer_vaild_1.updateOfferImageSchema), (0, auth_1.isAuth)([user_interface_1.Roles.SuperAdmin]), (0, errorHandling_1.asyncHandler)(offersService.updateOfferImage));
//delete offer
router.delete("/:id", (0, validation_1.valid)(offer_vaild_1.deleteOfferSchema), (0, auth_1.isAuth)([user_interface_1.Roles.SuperAdmin]), (0, errorHandling_1.asyncHandler)(offersService.deleteOffer));
exports.default = router;
