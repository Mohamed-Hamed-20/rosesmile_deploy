"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SheetSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    image: {
        type: {
            url: { type: String, required: true },
            id: { type: String, required: true },
        },
        required: true,
    },
    sheet_id: { type: String, required: true },
    sheet_weblink: { type: String, required: true },
    url: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
});
const sheetModel = (0, mongoose_1.model)('sheet', SheetSchema);
exports.default = sheetModel;
