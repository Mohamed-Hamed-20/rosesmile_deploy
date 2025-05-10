"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const env_1 = require("../config/env");
const redis = new ioredis_1.default({
    host: env_1.REDIS.HOST,
    port: env_1.REDIS.PORT,
    enableReadyCheck: true,
    maxRetriesPerRequest: null,
    retryStrategy(times) {
        return Math.min(times * 100, 3000);
    },
});
redis.on("connect", () => {
    console.log("Connected to Redis successfully!");
});
redis.on("error", (error) => {
    console.error("Redis connection error:", error);
});
exports.default = redis;
