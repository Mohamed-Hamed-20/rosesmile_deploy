"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validation_1 = require("../../middleware/validation");
const auth_1 = require("../../middleware/auth");
const user_interface_1 = require("../../DB/interfaces/user.interface");
const doctor_valid_1 = require("./doctor.valid");
const doctor_service_1 = __importDefault(require("./service/doctor.service"));
const multer_1 = require("../../utils/multer");
const errorHandling_1 = require("../../utils/errorHandling");
const sevice_valid_1 = require("../service/sevice.valid");
const doctorRouter = (0, express_1.Router)();
// Add a new doctor
doctorRouter.post('/', (0, multer_1.configureMulter)(1024 * 1024 * 5).single('image'), (0, validation_1.valid)(doctor_valid_1.addDoctorSchema), (0, auth_1.isAuth)([user_interface_1.Roles.SuperAdmin]), (0, errorHandling_1.asyncHandler)(doctor_service_1.default.addDoctor));
// Update an existing doctor
doctorRouter.put('/:doctorId', (0, validation_1.valid)(doctor_valid_1.updateDoctorSchema), (0, auth_1.isAuth)([user_interface_1.Roles.SuperAdmin]), (0, errorHandling_1.asyncHandler)(doctor_service_1.default.updateDoctor));
// Update a doctor's image
doctorRouter.put('/image/:doctorId', (0, multer_1.configureMulter)(1024 * 1024 * 5).single('image'), (0, auth_1.isAuth)([user_interface_1.Roles.SuperAdmin]), (0, errorHandling_1.asyncHandler)(doctor_service_1.default.updateDoctorImage));
// Add a case
doctorRouter.put('/cases/:doctorId', (0, multer_1.configureMulter)(1024 * 1024 * 5).single('image'), (0, validation_1.valid)(doctor_valid_1.DoctorIdSchema), (0, auth_1.isAuth)([user_interface_1.Roles.SuperAdmin]), (0, errorHandling_1.asyncHandler)(doctor_service_1.default.addCase));
// Delete a case
doctorRouter.delete('/cases/:doctorId', (0, validation_1.valid)(doctor_valid_1.deleteCaseSchema), (0, auth_1.isAuth)([user_interface_1.Roles.SuperAdmin]), (0, errorHandling_1.asyncHandler)(doctor_service_1.default.deleteCase));
// Delete a doctor
doctorRouter.delete('/:doctorId', (0, validation_1.valid)(doctor_valid_1.DoctorIdSchema), (0, auth_1.isAuth)([user_interface_1.Roles.SuperAdmin]), (0, errorHandling_1.asyncHandler)(doctor_service_1.default.deleteDoctor));
// Get all doctors
doctorRouter.get('/', (0, validation_1.valid)(sevice_valid_1.getServicesSchema), (0, errorHandling_1.asyncHandler)(doctor_service_1.default.getAllDoctors));
// Get a doctor by ID
doctorRouter.get('/:doctorId', (0, validation_1.valid)(doctor_valid_1.DoctorIdSchema), (0, errorHandling_1.asyncHandler)(doctor_service_1.default.getDoctorById));
exports.default = doctorRouter;
