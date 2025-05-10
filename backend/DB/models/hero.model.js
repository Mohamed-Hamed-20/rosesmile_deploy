"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const heroSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    image: {
        url: { type: String, required: true },
        id: { type: String, required: true },
    },
    buttonText: { type: String, required: true },
    buttonLink: { type: String, required: true },
}, {
    timestamps: true,
});
const heroModel = mongoose_1.default.model("hero", heroSchema);
exports.default = heroModel;
