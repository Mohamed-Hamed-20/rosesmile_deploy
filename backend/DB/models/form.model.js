"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const formSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    section: { type: mongoose_1.Schema.Types.ObjectId, ref: 'section', required: true },
    service: { type: mongoose_1.Schema.Types.ObjectId, ref: 'service' },
    city: { type: String, required: true },
    comment: { type: String },
    status: {
        type: String,
        enum: ['pending', 'absent', 'completed'],
        default: 'pending',
    },
    editedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'user' },
    spreadsheetId: { type: String, required: true },
    range: { type: String },
}, { timestamps: true });
const formModel = (0, mongoose_1.model)('form', formSchema);
exports.default = formModel;
