"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpreadsheetModel = void 0;
const mongoose_1 = require("mongoose");
const SpreadsheetSchema = new mongoose_1.Schema({
    spreadsheetId: { type: String, required: true, unique: true },
    spreadsheetTitle: { type: String, required: true },
    sheetNames: { type: [String], default: [], required: false },
}, {
    timestamps: true,
});
exports.SpreadsheetModel = (0, mongoose_1.model)("spreadsheet", SpreadsheetSchema);
