"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const serviceSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        minlength: [3, "title Must be at least 3, got {VALUE}"],
        maxlength: [300, "title Must be at most 30, got {VALUE}"],
        index: 1,
    },
    subTitle: {
        type: String,
        required: true,
        minlength: [3, "subTitle Must be at least 3, got {VALUE}"],
        maxlength: [300, "subTitle Must be at most 30, got {VALUE}"],
    },
    description: {
        type: [String],
        required: true,
        minlength: [1, "description Must be at least 3, got {VALUE}"],
        maxlength: [700, "description Must be at most 30, got {VALUE}"],
    },
    features: {
        type: [String],
        required: true,
        minlength: [1, "features Must be at least 3, got {VALUE}"],
        maxlength: [700, "features Must be at most 30, got {VALUE}"],
    },
    image: {
        type: {
            url: String,
            id: String,
        },
        required: true,
    },
    sectionId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "section",
        required: true,
    },
}, { timestamps: true });
const serviceModel = mongoose_1.default.model("service", serviceSchema);
exports.default = serviceModel;
