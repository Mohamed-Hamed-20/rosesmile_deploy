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
exports.cloudinaryInstance = exports.CloudinaryService = void 0;
const fs_1 = __importDefault(require("fs"));
const cloudinary_1 = require("cloudinary");
const env_1 = require("../config/env");
class CloudinaryService {
    constructor() {
        cloudinary_1.v2.config({
            cloud_name: env_1.CLOUDINARY.CLOUD_NAME,
            api_key: env_1.CLOUDINARY.API_KEY,
            api_secret: env_1.CLOUDINARY.API_SECRET,
        });
    }
    static getInstance() {
        if (!CloudinaryService.instance) {
            CloudinaryService.instance = new CloudinaryService();
        }
        return CloudinaryService.instance;
    }
    getCloudinary() {
        return cloudinary_1.v2;
    }
    uploadFile(filePath_1) {
        return __awaiter(this, arguments, void 0, function* (filePath, folder = "uploads", setting = env_1.CLOUDINARYOPTIONS.heroBanner) {
            console.time("⏱️ TOTAL Upload Time");
            console.time("⏳ Cloudinary Upload");
            try {
                const result = yield cloudinary_1.v2.uploader.upload(filePath, {
                    folder: `rose_smile/${folder}`,
                    transformation: [setting],
                    resource_type: "image",
                });
                console.timeEnd("⏳ Cloudinary Upload");
                if (fs_1.default.existsSync(filePath)) {
                    fs_1.default.unlink(filePath, (err) => {
                        if (err) {
                            console.error("Error deleting local file:", err.message);
                        }
                        else {
                            console.log("Local file deleted successfully");
                        }
                    });
                }
                console.timeEnd("⏱️ TOTAL Upload Time");
                return result;
            }
            catch (error) {
                throw new Error(`Cloudinary Upload Error: ${error.message}`);
            }
        });
    }
    deleteFile(publicId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield cloudinary_1.v2.uploader.destroy(publicId, {
                    invalidate: true,
                });
                console.log({ result });
                if (result.result === "ok") {
                    return true;
                }
                else {
                    throw new Error(`Cloudinary deletion failed: ${result.result}`);
                }
            }
            catch (error) {
                throw new Error(`Cloudinary Delete Error: ${error.message}`);
            }
        });
    }
    deleteMultipleFiles(publicIds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield cloudinary_1.v2.api.delete_resources(publicIds);
                const allDeleted = Object.values(result.deleted).every((val) => val === "deleted");
                return allDeleted;
            }
            catch (error) {
                throw new Error(`Cloudinary Bulk Delete Error: ${error.message}`);
            }
        });
    }
    updateFile(oldPublicId_1, filePath_1) {
        return __awaiter(this, arguments, void 0, function* (oldPublicId, filePath, options = env_1.CLOUDINARYOPTIONS.heroBanner) {
            try {
                // get folder from oldPublicId
                const parts = oldPublicId.split("/");
                const folder = parts.slice(0, -1).join("/");
                // upload new file
                const result = yield this.uploadFile(filePath, folder, options);
                // delete old file
                this.deleteFile(oldPublicId)
                    .then((res) => {
                    console.log({ res });
                })
                    .catch((err) => {
                    console.log({ err: err.message });
                });
                // delete local file
                if (fs_1.default.existsSync(filePath)) {
                    fs_1.default.unlink(filePath, (err) => {
                        if (err)
                            console.error("Error deleting local file:", err.message);
                    });
                }
                return result;
            }
            catch (error) {
                throw new Error(`Cloudinary Update Error: ${error.message}`);
            }
        });
    }
    imageVersions(publicId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [heroBanner, cardImage, thumbnailMedium, backgroundLarge] = yield Promise.all([
                this.generateImageUrl(publicId, env_1.CLOUDINARYOPTIONS.heroBanner),
                this.generateImageUrl(publicId, env_1.CLOUDINARYOPTIONS.cardImage),
                this.generateImageUrl(publicId, env_1.CLOUDINARYOPTIONS.thumbnailMedium),
                this.generateImageUrl(publicId, env_1.CLOUDINARYOPTIONS.backgroundLarge),
            ]);
            return { heroBanner, cardImage, thumbnailMedium, backgroundLarge };
        });
    }
    generateImageUrl(publicId, options = env_1.CLOUDINARYOPTIONS.heroBanner) {
        return cloudinary_1.v2.url(publicId, {
            transformation: [options],
        });
    }
}
exports.CloudinaryService = CloudinaryService;
exports.cloudinaryInstance = CloudinaryService.getInstance();
