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
exports.emailQueue = exports.EmailService = exports.addEmailToQueue = exports.sendEmailNow = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const bull_1 = __importDefault(require("bull"));
const env_1 = require("../config/env");
const user_model_1 = __importDefault(require("../DB/models/user.model"));
class EmailService {
    constructor({ to, subject = "No Subject", text = "", html = "<p>No Content</p>", message = "Mentora", }) {
        this.from = String(process.env.EMAIL);
        this.to = to;
        this.subject = subject;
        this.text = text;
        this.html = html;
        this.message = message;
    }
    static createTransporter() {
        if (!this.transporterInstance) {
            this.transporterInstance = nodemailer_1.default.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: env_1.EmailSendConfigration.EMAIL,
                    pass: env_1.EmailSendConfigration.PASSWORD,
                },
            });
        }
        return this.transporterInstance;
    }
    send() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transporter = EmailService.createTransporter();
                const info = yield transporter.sendMail({
                    from: `${this.message} <${this.from}>`,
                    to: this.to,
                    subject: this.subject,
                    text: this.text,
                    html: this.html,
                });
                console.log("Email sent:", info.messageId);
                return info.accepted.length > 0;
            }
            catch (error) {
                console.error("Error sending email:", error);
                return false;
            }
        });
    }
}
exports.EmailService = EmailService;
EmailService.transporterInstance = null;
// ============ Queue Setup =============
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
exports.emailQueue = emailQueue;
// ============ Queue Processor ==========
emailQueue.process((job) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`Processing email for: ${job.data.to}`);
        const emailInstance = new EmailService(job.data);
        const isSend = yield emailInstance.send();
        if (!isSend) {
            throw new Error(`Failed to send email to: ${job.data.to}`);
        }
        console.log("Email sent successfully!");
    }
    catch (error) {
        yield user_model_1.default.deleteOne({ email: job.data.to });
        console.error("Error sending email via queue:", error);
    }
}));
emailQueue.on("failed", (job, error) => {
    console.error(`Job failed for email: ${job.data.to}`, error);
});
// ============ Helper Functions ==========
const sendEmailNow = (emailData) => __awaiter(void 0, void 0, void 0, function* () {
    const emailInstance = new EmailService(emailData);
    return yield emailInstance.send();
});
exports.sendEmailNow = sendEmailNow;
const addEmailToQueue = (emailData) => __awaiter(void 0, void 0, void 0, function* () {
    yield emailQueue.add(emailData);
});
exports.addEmailToQueue = addEmailToQueue;
