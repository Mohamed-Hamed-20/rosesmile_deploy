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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSpreadsheets = exports.deleteSpreadsheet = exports.updateSpreadsheet = exports.createSpreadsheet = void 0;
const spreadsheet_model_1 = require("../../../DB/models/spreadsheet.model");
const errorHandling_1 = require("../../../utils/errorHandling");
const google_sheet_1 = require("../../../utils/google.sheet");
const createSpreadsheet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title } = req.body;
    const spreadsheetExist = yield spreadsheet_model_1.SpreadsheetModel.findOne({
        spreadsheetTitle: title,
    });
    if (spreadsheetExist) {
        return next(new errorHandling_1.CustomError("spreadsheet title is already Exist", 400));
    }
    const { spreadsheetId } = yield google_sheet_1.googleSheetInstance.createSpreadsheet(title);
    const newSpreadsheet = yield spreadsheet_model_1.SpreadsheetModel.create({
        spreadsheetTitle: title,
        spreadsheetId: spreadsheetId,
    });
    if (!newSpreadsheet) {
        return next(new errorHandling_1.CustomError("Failed to create spreadsheet in DB", 500));
    }
    return res.status(201).json({
        message: "Spreadsheet created successfully",
        data: newSpreadsheet,
    });
});
exports.createSpreadsheet = createSpreadsheet;
const updateSpreadsheet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { newtitle, spreadsheetId } = req.body;
    const spreadsheetExist = yield spreadsheet_model_1.SpreadsheetModel.findOne({
        spreadsheetTitle: spreadsheetId,
    });
    if (!spreadsheetExist) {
        return next(new errorHandling_1.CustomError("Invalid Spread sheet Id", 400));
    }
    const response = yield google_sheet_1.googleSheetInstance.updateSpreadsheet(spreadsheetId, newtitle);
    if (!response.newTitle || !response.spreadsheetId) {
        return next(new errorHandling_1.CustomError("Failed to update spreadsheet", 400));
    }
    const updatedSpreadsheet = yield spreadsheet_model_1.SpreadsheetModel.findOneAndUpdate({ spreadsheetId: response.spreadsheetId }, { spreadsheetTitle: response.newTitle }, { new: true });
    if (!updatedSpreadsheet) {
        return next(new errorHandling_1.CustomError("Failed to update spreadsheet in DB", 500));
    }
    return res.status(200).json({
        message: "Spreadsheet updated successfully",
        data: updatedSpreadsheet,
    });
});
exports.updateSpreadsheet = updateSpreadsheet;
const deleteSpreadsheet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { spreadsheetId } = req.body;
    const spreadsheetExist = yield spreadsheet_model_1.SpreadsheetModel.findOne({
        spreadsheetId: spreadsheetId,
    });
    if (!spreadsheetExist) {
        return next(new errorHandling_1.CustomError("Invalid Spread sheet Id", 400));
    }
    const { success } = yield google_sheet_1.googleSheetInstance.deleteSpreadsheet(spreadsheetId);
    if (!success) {
        return next(new errorHandling_1.CustomError("Failed to delete spreadsheet", 400));
    }
    const deletedSpreadsheet = yield spreadsheet_model_1.SpreadsheetModel.findOneAndDelete({
        spreadsheetId: spreadsheetId,
    });
    if (!deletedSpreadsheet) {
        return next(new errorHandling_1.CustomError("Failed to delete spreadsheet in DB", 500));
    }
    return res.status(200).json({
        message: "Spreadsheet deleted successfully",
        data: deletedSpreadsheet,
    });
});
exports.deleteSpreadsheet = deleteSpreadsheet;
const getAllSpreadsheets = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const spreadsheets = yield spreadsheet_model_1.SpreadsheetModel.find({}).select("-__v");
    if (!spreadsheets) {
        return next(new errorHandling_1.CustomError("Failed to fetch spreadsheets", 500));
    }
    return res.status(200).json({
        message: "Spreadsheets fetched successfully",
        data: spreadsheets,
    });
});
exports.getAllSpreadsheets = getAllSpreadsheets;
