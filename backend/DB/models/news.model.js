"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_2 = require("mongoose");
const newsSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    subTitle: { type: String, required: true },
    desc: { type: [String], required: true },
    image: { type: Object, required: true },
    serviceId: {
        type: mongoose_2.Types.ObjectId,
        ref: "service",
        required: true,
    },
}, {
    timestamps: true,
});
const newsModel = (0, mongoose_1.model)("news", newsSchema);
exports.default = newsModel;
