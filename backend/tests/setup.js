"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config({ path: ".env.test" });
// Set test database URI if not set
if (!process.env.TEST_DB_URI) {
    process.env.TEST_DB_URI = "mongodb://localhost:27017/rose-smile-test";
}
// Increase timeout for tests
jest.setTimeout(30000);
