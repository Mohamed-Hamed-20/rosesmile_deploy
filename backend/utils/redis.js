"use strict";
// import { Redis } from "@upstash/redis";
// import { REDIS } from "../config/env";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// const redis = new Redis({
//   url: REDIS.URL_Upstash,
//   token: REDIS.TOKEN_Upstash,
//   enableReadyCheck: true,
//   maxRetriesPerRequest: null,
//   retryStrategy(times) {
//     return Math.min(times * 100, 3000);
//   },
// });
// redis.on("connect", () => {
//   console.log("Connected to Redis successfully!");
// });
// redis.on("error", (error) => {
//   console.error("Redis connection error:", error);
// });
// export default redis;
const redis_1 = require("@upstash/redis");
const env_1 = require("../config/env");
// Upstash Redis client (HTTP/REST based)
const redis = new redis_1.Redis({
    url: env_1.REDIS.URL_Upstash,
    token: env_1.REDIS.TOKEN_Upstash,
    agent: false, // Disable the agent to avoid using a socket
});
// Test the connection immediately
function testConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield redis.ping();
            console.log("Connected to Upstash Redis successfully!");
        }
        catch (error) {
            console.error("Failed to connect to Upstash Redis:", error);
        }
    });
}
// Run the connection test
testConnection();
exports.default = redis;
