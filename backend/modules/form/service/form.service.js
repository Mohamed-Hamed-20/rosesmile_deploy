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
const form_model_1 = __importDefault(require("../../../DB/models/form.model"));
const errorHandling_1 = require("../../../utils/errorHandling");
const apiFeacture_1 = __importDefault(require("../../../utils/apiFeacture"));
const google_sheet_1 = require("../../../utils/google.sheet");
const service_model_1 = __importDefault(require("../../../DB/models/service.model"));
const section_model_1 = __importDefault(require("../../../DB/models/section.model"));
class Form {
    static addForm(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, phone, section, service, city, spreadsheetId } = req.body;
            let sectionTitle = '';
            let serviceTitle = '';
            const formData = {
                name,
                phone,
                city,
                spreadsheetId,
            };
            if (section && !service) {
                const sectionDoc = yield section_model_1.default.findById(section);
                if (!sectionDoc) {
                    return next(new errorHandling_1.CustomError('Section not found', 404));
                }
                sectionTitle = sectionDoc.title;
                formData.section = section;
            }
            if (service) {
                const serviceDoc = yield service_model_1.default.findById(service);
                const sectionDoc = yield section_model_1.default.findById(serviceDoc === null || serviceDoc === void 0 ? void 0 : serviceDoc.sectionId);
                if (!serviceDoc) {
                    return next(new errorHandling_1.CustomError('Service not found', 404));
                }
                serviceTitle = (serviceDoc === null || serviceDoc === void 0 ? void 0 : serviceDoc.title) || '';
                sectionTitle = (sectionDoc === null || sectionDoc === void 0 ? void 0 : sectionDoc.title) || '';
                formData.service = service;
                formData.section = sectionDoc === null || sectionDoc === void 0 ? void 0 : sectionDoc._id;
            }
            const range = yield google_sheet_1.googleSheetInstance.addRow(spreadsheetId, '2', [
                name,
                phone,
                sectionTitle,
                serviceTitle,
                city,
                '',
                'pending',
                new Date(),
                new Date(),
            ]);
            if (!range) {
                return next(new errorHandling_1.CustomError('Failed to add row to Google Sheet', 500));
            }
            formData.range = range.range;
            const form = new form_model_1.default(formData);
            const savedForm = yield form.save();
            if (!savedForm) {
                return next(new errorHandling_1.CustomError('Failed to create form', 500));
            }
            return res.status(201).json({
                message: 'Form created successfully',
                success: true,
                statusCode: 201,
                form: savedForm,
            });
        });
    }
    static updateCommentAndStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { id } = req.params;
            const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id;
            const { comment, status } = req.body;
            // Check if the request body is empty
            if (!Object.keys(req.body).length) {
                return next(new errorHandling_1.CustomError('No update data provided', 400));
            }
            const form = yield form_model_1.default.findById(id);
            if (!form) {
                return next(new errorHandling_1.CustomError('Form not found', 404));
            }
            if (comment)
                form.comment = comment;
            if (status)
                form.status = status;
            form.editedBy = userId;
            const updatedForm = yield form.save();
            if (updatedForm.spreadsheetId && updatedForm.range) {
                yield google_sheet_1.googleSheetInstance.updateRow(updatedForm.spreadsheetId, updatedForm.range, [
                    updatedForm.name,
                    updatedForm.phone,
                    updatedForm.section,
                    updatedForm.service,
                    updatedForm.city,
                    updatedForm.comment,
                    updatedForm.status,
                    updatedForm.createdAt,
                    updatedForm.updatedAt,
                ]);
            }
            if (!updatedForm) {
                return next(new errorHandling_1.CustomError('Failed to update form', 500));
            }
            return res.status(200).json({
                message: 'Form updated successfully',
                success: true,
                statusCode: 200,
                form: updatedForm,
            });
        });
    }
    static updateForm(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { id } = req.params;
            const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id;
            const { name, phone, service, city, comment, status } = req.body;
            // Check if the request body is empty
            if (!Object.keys(req.body).length) {
                return next(new errorHandling_1.CustomError('No update data provided', 400));
            }
            const form = yield form_model_1.default.findById(id);
            if (!form) {
                return next(new errorHandling_1.CustomError('Form not found', 404));
            }
            const updateForm = {};
            if (name)
                updateForm.name = name;
            if (phone)
                updateForm.phone = phone;
            if (service)
                updateForm.service = service;
            if (city)
                updateForm.city = city;
            if (comment && comment !== '')
                updateForm.comment = comment;
            if (status)
                updateForm.status = status;
            if (userId)
                updateForm.editedBy = userId;
            const updatedForm = yield form_model_1.default.findByIdAndUpdate(id, { $set: updateForm }, { new: true, runValidators: true, lean: true });
            if ((updatedForm === null || updatedForm === void 0 ? void 0 : updatedForm.spreadsheetId) && (updatedForm === null || updatedForm === void 0 ? void 0 : updatedForm.range)) {
                yield google_sheet_1.googleSheetInstance.updateRow(updatedForm.spreadsheetId, updatedForm.range, [
                    updatedForm.name,
                    updatedForm.phone,
                    updatedForm.section,
                    updatedForm.service,
                    updatedForm.city,
                    updatedForm.comment,
                    updatedForm.status,
                    updatedForm.createdAt,
                    updatedForm.updatedAt,
                ]);
            }
            if (!updatedForm) {
                return next(new errorHandling_1.CustomError('Failed to update form', 500));
            }
            return res.status(200).json({
                message: 'Form updated successfully',
                success: true,
                statusCode: 200,
                form: updatedForm,
            });
        });
    }
    static deleteForm(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const form = yield form_model_1.default.findByIdAndDelete(id);
            if ((form === null || form === void 0 ? void 0 : form.spreadsheetId) && (form === null || form === void 0 ? void 0 : form.range)) {
                console.log(form.spreadsheetId, form.range);
                yield google_sheet_1.googleSheetInstance.updateRow(form.spreadsheetId, form.range, [
                    form.name,
                    '',
                    '',
                    '',
                    '',
                    '',
                    'deleted',
                    '',
                    '',
                ]);
            }
            if (!form) {
                return next(new errorHandling_1.CustomError('Form not found', 404));
            }
            return res.status(200).json({
                message: 'Form deleted successfully',
                success: true,
                statusCode: 200,
            });
        });
    }
    static getFormById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const form = yield form_model_1.default
                .findById(id)
                .populate('service', 'title')
                .populate('section', 'title')
                .populate('editedBy', 'firstName lastName');
            if (!form) {
                return next(new errorHandling_1.CustomError('Form not found', 404));
            }
            return res.status(200).json({
                message: 'Form retrieved successfully',
                success: true,
                statusCode: 200,
                form,
            });
        });
    }
    static getAllForms(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, size, search, sort, select } = req.query;
            const pipeline = new apiFeacture_1.default()
                .match({
                fields: Form.allowSearchFields,
                search: (search === null || search === void 0 ? void 0 : search.toString()) || '',
                op: '$or',
            })
                .sort((sort === null || sort === void 0 ? void 0 : sort.toString()) || '')
                .paginate(Number(page) || 1, Number(size) || 100)
                .lookUp({
                from: 'sections',
                localField: 'section',
                foreignField: '_id',
                as: 'section',
                isArray: false,
            }, {
                title: 1,
            })
                .lookUp({
                from: 'services',
                localField: 'service',
                foreignField: '_id',
                as: 'service',
                isArray: false,
            }, {
                title: 1,
            })
                .lookUp({
                from: 'users',
                localField: 'editedBy',
                foreignField: '_id',
                as: 'editedBy',
                isArray: false,
            }, {
                firstName: 1,
                lastName: 1,
            })
                .projection({
                allowFields: Form.defaultFields,
                defaultFields: Form.defaultFields,
                select: (select === null || select === void 0 ? void 0 : select.toString()) || '',
            })
                .build();
            const [total, forms] = yield Promise.all([
                form_model_1.default.countDocuments({}).lean(),
                form_model_1.default.aggregate(pipeline).exec(),
            ]);
            return res.status(200).json({
                message: 'Forms retrieved successfully',
                success: true,
                statusCode: 200,
                totalForms: total,
                totalPages: Math.ceil(total / Number(size || 21)),
                forms,
            });
        });
    }
}
Form.allowSearchFields = ['name', 'phone', 'service', 'city', 'status'];
Form.defaultFields = [
    'name',
    'phone',
    'section',
    'service',
    'city',
    'comment',
    'status',
    'editedBy',
    'spreadsheetId',
    'range',
    'createdAt',
    'updatedAt',
];
exports.default = Form;
