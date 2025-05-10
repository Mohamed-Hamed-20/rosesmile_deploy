"use strict";
// utils/multerConfig.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerMemory = exports.configureMulter = exports.FileType = void 0;
const multer_1 = __importDefault(require("multer"));
const errorHandling_1 = require("./errorHandling");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.FileType = {
    Images: [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/gif",
        "image/bmp",
        "image/webp",
        "image/tiff",
        "image/svg+xml",
        "image/heif",
        "image/heic",
        "image/avif",
        "image/x-icon",
        "image/vnd.microsoft.icon",
        "image/vnd.wap.wbmp",
        "image/jp2",
        "image/jxr",
        "image/x-citrix-jpeg",
        "image/x-citrix-png",
        "image/x-portable-anymap",
        "image/x-portable-bitmap",
        "image/x-portable-graymap",
        "image/x-portable-pixmap",
        "image/x-tga",
        "image/x-xbitmap",
        "image/x-xpixmap",
    ],
    Videos: [
        "video/mp4",
        "video/mpeg",
        "video/webm",
        "video/ogg",
        "video/avi",
        "video/mov",
        "video/wmv",
        "video/flv",
        "video/mkv",
    ],
    Audios: [
        "audio/mpeg",
        "audio/wav",
        "audio/ogg",
        "audio/mp3",
        "audio/flac",
        "audio/aac",
        "audio/m4a",
        "audio/wma",
        "audio/amr",
    ],
    Files: [
        "application/pdf",
        "application/javascript",
        "application/json",
        "text/plain",
        "text/html",
        "application/xml",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ],
    Archives: [
        "application/zip",
        "application/x-rar-compressed",
        "application/x-7z-compressed",
        "application/gzip",
        "application/x-tar",
    ],
    Others: ["application/octet-stream", "application/x-msdownload"],
};
const configureMulter = (fileSize = 7 * 1024 * 1024, allowedFileTypes = exports.FileType.Images, folder = "uploads") => {
    const storage = multer_1.default.diskStorage({
        destination(req, file, callback) {
            try {
                const uploadPath = path_1.default.join(process.cwd(), folder);
                if (!fs_1.default.existsSync(uploadPath)) {
                    fs_1.default.mkdirSync(uploadPath, { recursive: true });
                }
                callback(null, uploadPath);
            }
            catch (error) {
                callback(new Error("Failed to create upload directory"), "");
            }
        },
        filename(req, file, callback) {
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            callback(null, `${file.fieldname}-${uniqueSuffix}-${file.originalname}`);
        },
    });
    const fileFilter = (req, file, callback) => {
        if (allowedFileTypes.includes(file.mimetype)) {
            callback(null, true);
        }
        else {
            callback(new errorHandling_1.CustomError(`Invalid file type: ${file.mimetype}.`, 400), false);
        }
    };
    const limits = { fileSize };
    return (0, multer_1.default)({ storage, fileFilter, limits });
};
exports.configureMulter = configureMulter;
const multerMemory = (fileSize = 5 * 1024 * 1024, allowedFileTypes = exports.FileType.Images) => {
    const storage = multer_1.default.memoryStorage();
    const fileFilter = (req, file, callback) => {
        if (allowedFileTypes.includes(file.mimetype)) {
            callback(null, true);
        }
        else {
            callback(new errorHandling_1.CustomError(`Invalid file type: ${file.mimetype}.`, 400), false);
        }
    };
    const limits = { fileSize };
    return (0, multer_1.default)({ storage, fileFilter, limits });
};
exports.multerMemory = multerMemory;
