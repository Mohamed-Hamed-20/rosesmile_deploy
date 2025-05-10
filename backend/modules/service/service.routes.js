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
const serviceController = __importStar(require("./service/service.service"));
const auth_1 = require("../../middleware/auth");
const user_interface_1 = require("../../DB/interfaces/user.interface");
const validation_1 = require("../../middleware/validation");
const sevice_valid_1 = require("./sevice.valid");
const errorHandling_1 = require("../../utils/errorHandling");
const multer_1 = require("../../utils/multer");
const router = (0, express_1.Router)();
// create a new service
router.post("/", (0, auth_1.isAuth)([user_interface_1.Roles.SuperAdmin]), (0, multer_1.configureMulter)(1024 * 1024 * 7, multer_1.FileType.Images).single("image"), (0, validation_1.valid)(sevice_valid_1.addServiceSchema), (0, errorHandling_1.asyncHandler)(serviceController.createService));
// update a service by id
router.put("/:id", (0, validation_1.valid)(sevice_valid_1.updateServiceSchema), (0, auth_1.isAuth)([user_interface_1.Roles.SuperAdmin]), (0, errorHandling_1.asyncHandler)(serviceController.updateService));
// update a service image
router.put("/image/:id", (0, auth_1.isAuth)([user_interface_1.Roles.SuperAdmin]), (0, multer_1.configureMulter)(1024 * 1024 * 7, multer_1.FileType.Images).single("image"), (0, validation_1.valid)(sevice_valid_1.updateServiceImageSchema), (0, errorHandling_1.asyncHandler)(serviceController.updateServiceImage));
// delete a service by id
router.delete("/:id", (0, validation_1.valid)(sevice_valid_1.deleteServiceSchema), (0, auth_1.isAuth)([user_interface_1.Roles.SuperAdmin]), (0, errorHandling_1.asyncHandler)(serviceController.deleteService));
// get all services
router.get("/", (0, validation_1.valid)(sevice_valid_1.getServicesSchema), (0, errorHandling_1.asyncHandler)(serviceController.getServices));
// get a service by id
router.get("/:id", (0, validation_1.valid)(sevice_valid_1.getServiceByIdSchema), (0, errorHandling_1.asyncHandler)(serviceController.getServiceById));
// add new images to a service
// router.post(
//   "/:id/images",
//   valid(addServiceImagesSchema) as RequestHandler,
//   isAuth([Roles.Admin, Roles.SuperAdmin]),
//   asyncHandler(serviceController.addNewImagesService)
// );
// delete a service image
// router.delete(
//   "/:id/images/:imageId",
//   valid(deleteServiceImageSchema) as RequestHandler,
//   isAuth([Roles.Admin, Roles.SuperAdmin]),
//   asyncHandler(serviceController.deleteServiceImage)
// );
exports.default = router;
