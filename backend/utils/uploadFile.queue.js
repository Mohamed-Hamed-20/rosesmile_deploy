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
const bull_1 = __importDefault(require("bull"));
const env_1 = require("../config/env");
const aws_sdk_s3_1 = __importDefault(require("./aws.sdk.s3"));
// 🔹 Initialize File Queue
const FileQueue = new bull_1.default("FileUpload", {
    redis: {
        host: env_1.REDIS.HOST,
        port: env_1.REDIS.PORT,
        maxRetriesPerRequest: null,
        retryStrategy: (times) => Math.min(times * 100, 3000),
    },
});
// 🔹 Function to process file uploads
const processFileUpload = (job) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { file, model, value, key } = job.data;
    try {
        console.log(`🚀 Processing file upload: ${file}`);
        const s3 = new aws_sdk_s3_1.default();
        const response = yield s3.uploadLargeFile(file);
        if (response instanceof Error) {
            console.error("❌ Upload Failed:", response.message);
            yield ((_a = model === null || model === void 0 ? void 0 : model.deleteOne) === null || _a === void 0 ? void 0 : _a.call(model, { [key]: value }));
            throw response; // Mark job as failed
        }
        console.log("✅ File uploaded successfully!");
    }
    catch (error) {
        console.error("❌ Error during file upload:", error);
        yield ((_b = model === null || model === void 0 ? void 0 : model.deleteOne) === null || _b === void 0 ? void 0 : _b.call(model, { [key]: value }));
        throw error; // Mark job as failed
    }
});
// 🔹 Attach Processor
FileQueue.process(processFileUpload);
// 🔹 Event Listener for Failures
FileQueue.on("failed", (job, error) => {
    console.error(`❌ Job failed for file: ${job.data.file}`, error);
});
exports.default = FileQueue;
