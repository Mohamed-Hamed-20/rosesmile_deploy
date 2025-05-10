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
exports.GoogleSheet = exports.Sheet = void 0;
const google_sheet_1 = require("../../../utils/google.sheet");
const errorHandling_1 = require("../../../utils/errorHandling");
const sheet_model_1 = __importDefault(require("../../../DB/models/sheet.model"));
const cloudinary_1 = require("../../../utils/cloudinary");
const apiFeacture_1 = __importDefault(require("../../../utils/apiFeacture"));
class Sheet {
    static createSheet(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, url } = req.body;
            if (!(req === null || req === void 0 ? void 0 : req.file)) {
                return next(new errorHandling_1.CustomError('No files uploaded', 400));
            }
            const existingSheet = yield sheet_model_1.default.exists({ url });
            if (existingSheet) {
                return next(new errorHandling_1.CustomError('Sheet with this URL already exists', 400));
            }
            const spreadsheetId = yield google_sheet_1.googleSheetInstance.createNewSheet(title);
            const sheet = new sheet_model_1.default({
                title,
                sheet_id: spreadsheetId,
                sheet_weblink: `https://docs.google.com/spreadsheets/d/${spreadsheetId}`,
                url,
            });
            const { secure_url, public_id } = yield cloudinary_1.cloudinaryInstance.uploadFile(req.file.path, `sheet/${sheet._id}`);
            sheet.image = { url: secure_url, id: public_id };
            const savedSheet = yield sheet.save();
            if (!savedSheet) {
                yield cloudinary_1.cloudinaryInstance.deleteFile(public_id);
                return next(new errorHandling_1.CustomError('Failed to create sheet', 500));
            }
            yield google_sheet_1.googleSheetInstance.addRow(spreadsheetId, '1', [
                'الاسم',
                'رقم الجوال',
                'القسم',
                'الخدمة',
                'المدينة',
                'تعليق',
                'الحالة',
                'تاريخ الطلب',
                'تاريخ التعديل',
            ]);
            return res.status(201).json({
                message: 'Sheet created successfully',
                success: true,
                statusCode: 201,
                savedSheet,
            });
        });
    }
    static updateSheet(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { sheetId } = req.params;
            const { title, url } = req.body;
            // Check if the request body is empty
            if (!Object.keys(req.body).length) {
                return next(new errorHandling_1.CustomError('No update data provided', 400));
            }
            const findSheet = yield sheet_model_1.default.findById(sheetId);
            if (!findSheet) {
                return next(new errorHandling_1.CustomError('Sheet not found', 404));
            }
            const updateSheet = {};
            if (title)
                updateSheet.title = title;
            if (url)
                updateSheet.url = url;
            const sheet = yield sheet_model_1.default.findByIdAndUpdate(sheetId, { $set: updateSheet }, { new: true, runValidators: true, lean: true });
            return res.status(200).json({
                message: 'Sheet updated successfully',
                success: true,
                statusCode: 200,
                sheet,
            });
        });
    }
    static updateSheetImage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { sheetId } = req.params;
            // Check if the request body is empty
            if (!(req === null || req === void 0 ? void 0 : req.file)) {
                return next(new errorHandling_1.CustomError('No files uploaded', 400));
            }
            const findSheet = yield sheet_model_1.default.findById(sheetId);
            if (!findSheet) {
                return next(new errorHandling_1.CustomError('Sheet not found', 404));
            }
            const { secure_url, public_id } = yield cloudinary_1.cloudinaryInstance.uploadFile(req.file.path, `sheet/${sheetId}`);
            findSheet.image = { url: secure_url, id: public_id };
            yield findSheet.save();
            return res.status(200).json({
                message: 'Sheet image updated successfully',
                success: true,
                statusCode: 200,
                sheet: findSheet,
            });
        });
    }
    static getAllSheets(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, size, search, sort, select } = req.query;
            const pipeline = new apiFeacture_1.default()
                .match({
                fields: Sheet.allowSearchFields,
                search: (search === null || search === void 0 ? void 0 : search.toString()) || '',
                op: '$or',
            })
                .sort((sort === null || sort === void 0 ? void 0 : sort.toString()) || '')
                .paginate(Number(page) || 1, Number(size) || 100)
                .projection({
                allowFields: Sheet.defaultFields,
                defaultFields: Sheet.defaultFields,
                select: (select === null || select === void 0 ? void 0 : select.toString()) || '',
            })
                .build();
            const [total, sheets] = yield Promise.all([
                sheet_model_1.default.countDocuments({}).lean(),
                sheet_model_1.default.aggregate(pipeline).exec(),
            ]);
            return res.status(200).json({
                message: 'Sheets retrieved successfully',
                success: true,
                statusCode: 200,
                totalSheets: total,
                totalPages: Math.ceil(total / Number(size || 21)),
                sheets,
            });
        });
    }
    static getSheetByUrl(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = req.params.url;
            let sheet = yield sheet_model_1.default.findOne({ url });
            if (!sheet) {
                sheet = yield sheet_model_1.default.findOne({ url: 'default' });
            }
            return res.status(200).json({
                message: 'Sheet retrieved successfully',
                success: true,
                statusCode: 200,
                sheet,
            });
        });
    }
    static deleteSheet(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const sheet = yield sheet_model_1.default.findById(id);
            if (!sheet) {
                return next(new errorHandling_1.CustomError('Sheet not found', 404));
            }
            // Prevent deletion of the default sheet
            if (sheet.url === 'default') {
                return next(new errorHandling_1.CustomError('Cannot delete the default sheet', 403));
            }
            yield sheet_model_1.default.findByIdAndDelete(id);
            yield google_sheet_1.googleSheetInstance.deleteSheet(sheet.sheet_id);
            yield cloudinary_1.cloudinaryInstance.deleteFile(sheet.image.id);
            return res.status(200).json({
                message: 'Sheet deleted successfully',
                success: true,
                statusCode: 200,
            });
        });
    }
}
exports.Sheet = Sheet;
Sheet.allowSearchFields = ['title', 'url'];
Sheet.defaultFields = ['title', 'image', 'sheet_id', 'sheet_weblink', 'url'];
class GoogleSheet {
}
exports.GoogleSheet = GoogleSheet;
