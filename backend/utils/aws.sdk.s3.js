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
const fs_1 = __importDefault(require("fs"));
const client_s3_1 = require("@aws-sdk/client-s3");
const env_1 = require("../config/env");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const lib_storage_1 = require("@aws-sdk/lib-storage");
const errorHandling_1 = require("./errorHandling");
class S3Instance {
    constructor() {
        var _a, _b;
        this.s3 = new client_s3_1.S3Client({
            region: env_1.AWS_S3Keys.REGION,
            endpoint: env_1.AWS_S3Keys.ENDPOINT_URL,
            credentials: {
                accessKeyId: (_a = env_1.AWS_S3Keys.ACCESS_KEY) !== null && _a !== void 0 ? _a : "",
                secretAccessKey: (_b = env_1.AWS_S3Keys.SECRET_KEY) !== null && _b !== void 0 ? _b : "",
            },
        });
    }
    createBucket(bucketName) {
        return __awaiter(this, void 0, void 0, function* () {
            // create bucket
            return yield this.s3.send(new client_s3_1.CreateBucketCommand({ Bucket: bucketName }));
        });
    }
    deleteBucket(bucketName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.s3.send(new client_s3_1.DeleteBucketCommand({ Bucket: bucketName }));
        });
    }
    getFileUrlToUpload(fileName_1) {
        return __awaiter(this, arguments, void 0, function* (fileName, expireIn = 3600) {
            const url = yield (0, s3_request_presigner_1.getSignedUrl)(this.s3, new client_s3_1.GetObjectCommand({
                Bucket: env_1.AWS_S3Keys.BUCKET_NAME,
                Key: fileName,
            }), { expiresIn: expireIn });
            console.log(`🔗 Signed URL: ${url}`);
            return url;
        });
    }
    uploadLargeFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!file.folder) {
                return new errorHandling_1.CustomError("Folder folder and uniqueName is required", 400);
            }
            const upload = new lib_storage_1.Upload({
                client: this.s3,
                params: {
                    Bucket: env_1.AWS_S3Keys.BUCKET_NAME,
                    Key: file.folder,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                    ACL: "public-read",
                },
                partSize: 10 * 1024 * 1024, // 10 MB
            });
            upload.on("httpUploadProgress", (progress) => {
                console.log(`📤 Progress: ${progress.loaded} / ${progress.total}`);
                console.log(`🚀 key : ${progress.Key} , part : ${progress.part}`);
            });
            const response = yield upload.done();
            if (response.$metadata.httpStatusCode !== 200)
                return new errorHandling_1.CustomError("Failed to upload file", 500);
            console.log("✅ Large file uploaded successfully!");
            return response;
        });
    }
    uploadMulipleLargeFile(file, folder, uniqueName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!file || !folder || !uniqueName) {
                return new errorHandling_1.CustomError("File, folder, and uniqueName are required", 400);
            }
            const key = `${folder}/${uniqueName}`;
            const upload = new lib_storage_1.Upload({
                client: this.s3,
                params: {
                    Bucket: env_1.AWS_S3Keys.BUCKET_NAME,
                    Key: key,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                    ACL: "public-read",
                },
                partSize: 10 * 1024 * 1024, // 10 MB
            });
            upload.on("httpUploadProgress", (progress) => {
                console.log(`📤 Uploading: ${progress.loaded} / ${progress.total}`);
            });
            const response = yield upload.done();
            if (response.$metadata.httpStatusCode !== 200) {
                return new errorHandling_1.CustomError("Failed to upload file", 500);
            }
            console.log("✅ Video uploaded successfully!");
            return {
                Key: key,
                Location: `https://${env_1.AWS_S3Keys.BUCKET_NAME}.s3.amazonaws.com/${key}`,
            };
        });
    }
    uploadLargeFileWithPath(file) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!file.path) {
                return new errorHandling_1.CustomError("File path is required", 400);
            }
            if (!file.folder) {
                return new errorHandling_1.CustomError("File Folder is required", 400);
            }
            const upload = new lib_storage_1.Upload({
                client: this.s3,
                params: {
                    Bucket: env_1.AWS_S3Keys.BUCKET_NAME,
                    Key: file.folder,
                    Body: fs_1.default.createReadStream(file.path),
                    ContentType: file.mimetype,
                },
                partSize: 10 * 1024 * 1024, // 10 MB
            });
            upload.on("httpUploadProgress", (progress) => {
                console.log(`📤 Progress: ${progress.loaded} / ${progress.total}`);
            });
            try {
                const response = yield upload.done();
                if (response.$metadata.httpStatusCode !== 200) {
                    throw new errorHandling_1.CustomError("Failed to upload file", 500);
                }
                console.log("✅ Large file uploaded successfully!");
                fs_1.default.unlinkSync(file.path);
                return response;
            }
            catch (error) {
                console.error("❌ Upload failed:", error);
                fs_1.default.unlinkSync(file.path);
                throw new errorHandling_1.CustomError("Upload failed", 500);
            }
        });
    }
    uploadFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!file.folder) {
                return new errorHandling_1.CustomError("Folder folder and uniqueName is required", 400);
            }
            const response = yield this.s3.send(new client_s3_1.PutObjectCommand({
                Bucket: env_1.AWS_S3Keys.BUCKET_NAME,
                Key: file.folder,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: "public-read",
            }));
            if (response.$metadata.httpStatusCode !== 200)
                return new errorHandling_1.CustomError("Failed to upload file", 500);
            console.log("✅ File uploaded successfully!");
            return response;
        });
    }
    uploadMultipleFiles(files) {
        return __awaiter(this, void 0, void 0, function* () {
            const uploadPromises = files.map((file) => {
                return this.uploadFile(file);
            });
            return Promise.all(uploadPromises);
        });
    }
    deleteFile(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.s3.send(new client_s3_1.DeleteObjectCommand({
                Bucket: env_1.AWS_S3Keys.BUCKET_NAME,
                Key: key,
            }));
            if (response.$metadata.httpStatusCode !== 204)
                return new errorHandling_1.CustomError("Failed to delete file", 500);
            console.log("✅ File deleted successfully!");
            return response;
        });
    }
    deleteFiles(keys) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletePromises = keys.map((key) => __awaiter(this, void 0, void 0, function* () {
                return this.deleteFile(key);
            }));
            return yield Promise.all(deletePromises);
        });
    }
    getFile(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = yield (0, s3_request_presigner_1.getSignedUrl)(this.s3, new client_s3_1.GetObjectCommand({
                Bucket: env_1.AWS_S3Keys.BUCKET_NAME,
                Key: key,
            }), { expiresIn: 3 * 3600 } // 3 hour
            );
            // console.log("✅ Signed URL generated successfully!");
            return url;
        });
    }
    getFiles(keys) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePromises = keys.map((key) => this.getFile(key));
            const results = yield Promise.allSettled(filePromises);
            return results
                .filter((result) => result.status === "fulfilled")
                .map((result) => result.value);
        });
    }
}
exports.default = S3Instance;
