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
const user_interface_1 = require("../interfaces/user.interface");
const userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: [3, "firstName Must be at least 3, got {VALUE}"],
        maxlength: [30, "firstName Must be at most 30, got {VALUE}"],
        index: 1,
    },
    lastName: {
        type: String,
        required: true,
        minlength: [3, "last Name Must be at least 3, got {VALUE}"],
        maxlength: [30, "last Name Must be at most 30, got {VALUE}"],
        index: 1,
    },
    email: {
        type: String,
        required: true,
        minlength: [6, "email Must be at least 6, got {VALUE}"],
        maxlength: [70, "email Must be at most 30, got {VALUE}"],
        unique: true,
        index: 1,
        match: [
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Please provide a valid email address",
        ],
    },
    password: {
        type: String,
        required: true,
        minlength: [8, "Password must be at least 8 characters long"],
    },
    role: {
        type: String,
        enum: Object.values(user_interface_1.Roles),
        default: user_interface_1.Roles.User,
    },
    phone: {
        type: String,
    },
    isConfirmed: {
        type: Boolean,
        required: false,
        default: false,
    },
    isOnline: {
        type: Boolean,
        default: false,
    },
    image: {
        type: {
            id: String,
            url: {
                type: String,
                required: false,
            },
        },
        required: false,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
const userModel = mongoose_1.default.model("user", userSchema);
exports.default = userModel;
