"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandling_1 = require("../../../utils/errorHandling");
const doctor_model_1 = require("../../../DB/models/doctor.model");
const cloudinary_1 = require("../../../utils/cloudinary");
const apiFeacture_1 = __importDefault(require("../../../utils/apiFeacture"));
class Doctor {
    static addDoctor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, specialization, description } = req.body;
            if (!(req === null || req === void 0 ? void 0 : req.file)) {
                return next(new errorHandling_1.CustomError('No files uploaded', 400));
            }
            const doctor = new doctor_model_1.doctorModel({
                name,
                specialization,
                description,
            });
            const { secure_url, public_id } = yield cloudinary_1.cloudinaryInstance.uploadFile(req.file.path, `doctor/${doctor._id}`);
            doctor.image = { url: secure_url, id: public_id };
            const savedDoctor = yield doctor.save();
            if (!savedDoctor) {
                yield cloudinary_1.cloudinaryInstance.deleteFile(public_id);
                return next(new errorHandling_1.CustomError('Failed to create doctor', 500));
            }
            return res.status(201).json({
                message: 'Doctor created successfully',
                success: true,
                statusCode: 201,
                doctor: savedDoctor,
            });
        });
    }
    static updateDoctor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { doctorId } = req.params;
            const { name, specialization, description } = req.body;
            // Check if the request body is empty
            if (!Object.keys(req.body).length) {
                return next(new errorHandling_1.CustomError('No update data provided', 400));
            }
            const findDoctor = yield doctor_model_1.doctorModel.findById(doctorId);
            if (!findDoctor) {
                return next(new errorHandling_1.CustomError('Doctor not found', 404));
            }
            const updateDoctor = {};
            if (name)
                updateDoctor.name = name;
            if (specialization)
                updateDoctor.specialization = specialization;
            if (description)
                updateDoctor.description = description;
            const doctor = yield doctor_model_1.doctorModel.findByIdAndUpdate(doctorId, { $set: updateDoctor }, { new: true, runValidators: true, lean: true });
            return res.status(200).json({
                message: 'Doctor updated successfully',
                success: true,
                statusCode: 200,
                doctor,
            });
        });
    }
    static updateDoctorImage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { doctorId } = req.params;
            const doctor = yield doctor_model_1.doctorModel.findById(doctorId);
            if (!doctor) {
                return next(new errorHandling_1.CustomError('Doctor not found', 404));
            }
            const oldImageId = doctor.image.id;
            if (!(req === null || req === void 0 ? void 0 : req.file)) {
                return next(new errorHandling_1.CustomError('No files uploaded', 400));
            }
            const { secure_url, public_id } = yield cloudinary_1.cloudinaryInstance.uploadFile(req.file.path, `doctor/${doctorId}`);
            doctor.image = { url: secure_url, id: public_id };
            yield doctor.save();
            if (oldImageId) {
                yield cloudinary_1.cloudinaryInstance.deleteFile(oldImageId);
            }
            return res.status(200).json({
                message: 'Doctor image updated successfully',
                success: true,
                statusCode: 200,
                doctor,
            });
        });
    }
    static addCase(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { doctorId } = req.params;
            const doctor = yield doctor_model_1.doctorModel.findById(doctorId);
            if (!doctor) {
                return next(new errorHandling_1.CustomError('Doctor not found', 404));
            }
            if (!(req === null || req === void 0 ? void 0 : req.file)) {
                return next(new errorHandling_1.CustomError('No files uploaded', 400));
            }
            const { secure_url, public_id } = yield cloudinary_1.cloudinaryInstance.uploadFile(req.file.path, `doctor/${doctorId}/case`);
            doctor.cases.push({ url: secure_url, id: public_id });
            yield doctor.save();
            return res.status(200).json({
                message: 'Case added successfully',
                success: true,
                statusCode: 200,
                doctor,
            });
        });
    }
    static deleteCase(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { doctorId } = req.params;
            const { caseId } = req.body;
            const doctor = yield doctor_model_1.doctorModel.findById(doctorId);
            if (!doctor) {
                return next(new errorHandling_1.CustomError('Doctor not found', 404));
            }
            const caseIndex = doctor.cases.findIndex((c) => { var _a; return ((_a = c._id) === null || _a === void 0 ? void 0 : _a.toString()) === caseId; });
            if (caseIndex === -1) {
                return next(new errorHandling_1.CustomError('Case not found', 404));
            }
            const caseToDelete = doctor.cases[caseIndex];
            yield cloudinary_1.cloudinaryInstance.deleteFile(caseToDelete.id);
            doctor.cases.splice(caseIndex, 1);
            yield doctor.save();
            return res.status(200).json({
                message: 'Case deleted successfully',
                success: true,
                statusCode: 200,
                doctor,
            });
        });
    }
    static deleteDoctor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { doctorId } = req.params;
            const doctor = yield doctor_model_1.doctorModel.findByIdAndDelete(doctorId);
            if (!doctor) {
                return next(new errorHandling_1.CustomError('Doctor not found', 404));
            }
            yield cloudinary_1.cloudinaryInstance.deleteFile(doctor.image.id);
            return res.status(200).json({
                message: 'Doctor deleted successfully',
                success: true,
                statusCode: 200,
            });
        });
    }
    static getAllDoctors(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, size, search, sort, select } = req.query;
            const pipeline = new apiFeacture_1.default()
                .match({
                fields: Doctor.allowSearchFields,
                search: (search === null || search === void 0 ? void 0 : search.toString()) || '',
                op: '$or',
            })
                .sort((sort === null || sort === void 0 ? void 0 : sort.toString()) || '')
                .paginate(Number(page) || 1, Number(size) || 100)
                .projection({
                allowFields: Doctor.defaultFields,
                defaultFields: Doctor.defaultFields,
                select: (select === null || select === void 0 ? void 0 : select.toString()) || '',
            })
                .build();
            const [total, doctors] = yield Promise.all([
                doctor_model_1.doctorModel.countDocuments({}).lean(),
                doctor_model_1.doctorModel.aggregate(pipeline).exec(),
            ]);
            return res.status(200).json({
                message: 'Doctors retrieved successfully',
                success: true,
                statusCode: 200,
                totalDoctors: total,
                totalPages: Math.ceil(total / Number(size || 21)),
                doctors,
            });
        });
    }
    static getDoctorById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { doctorId } = req.params;
            const doctor = yield doctor_model_1.doctorModel.findById(doctorId);
            if (!doctor) {
                return next(new errorHandling_1.CustomError('Doctor not found', 404));
            }
            return res.status(200).json({
                message: 'Doctor retrieved successfully',
                success: true,
                statusCode: 200,
                doctor,
            });
        });
    }
}
Doctor.allowSearchFields = ['name', 'specialization'];
Doctor.defaultFields = ['name', 'image', 'specialization', 'description'];
exports.default = Doctor;
