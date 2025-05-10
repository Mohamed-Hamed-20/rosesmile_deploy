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
const nodemailer_1 = __importDefault(require("./nodemailer"));
const user_model_1 = __importDefault(require("../DB/models/user.model"));
const env_1 = require("../config/env");
const emailQueue = new bull_1.default("emailQueue", {
    redis: {
        host: env_1.REDIS.HOST,
        port: env_1.REDIS.PORT,
        maxRetriesPerRequest: null,
        retryStrategy(times) {
            return Math.min(times * 100, 3000);
        },
    },
});
emailQueue.process((job) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`Processing email for: ${job.data.to}`);
        const emailInstance = new nodemailer_1.default(Object.assign({}, job.data));
        const isSend = yield emailInstance.send();
        if (!isSend) {
            throw new Error(`ERROR IN SENDING EMAIL to user: ${job.data.to}`);
        }
        console.log("Email sent successfully!");
    }
    catch (error) {
        yield user_model_1.default.deleteOne({ email: job.data.to });
        console.error("Error sending email:");
    }
}));
emailQueue.on("failed", (job, error) => {
    console.error(`Job failed for email: ${job.data.to}`, error);
});
exports.default = emailQueue;
