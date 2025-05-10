"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errorHandling_1 = require("./utils/errorHandling");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const redis_1 = __importDefault(require("./utils/redis"));
const index_Routes_1 = __importDefault(require("./index.Routes"));
const env_1 = require("./config/env");
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const app = (0, express_1.default)();
app.use((0, compression_1.default)({ level: 6, memLevel: 8, threshold: 0 }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(
  (0, cors_1.default)({
    credentials: true,
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://rose-smile.vercel.app",
      "https://rose-smile.vercel.app/",
      "http://rose-smile.vercel.app/",
      "http://localhost:3000",
      "http://localhost:3000/",
      "http://115.234.7.2:3000/",
      "http://115.234.7.2:3000/",
    ],
  })
);
console.log(process.cwd());
redis_1.default;
app.use(
  "/uploads",
  express_1.default.static(path_1.default.join(process.cwd(), "uploads"))
);
app.use((0, morgan_1.default)("dev"));
// API routes
app.use("/api/v1", index_Routes_1.default);
app.get("/", (req, res) => {
  return res.json({
    message: "welcome to our Application",
    ApiDocumentation: env_1.ApiDocumentation,
  });
});
// Handle invalid routes
app.all("*", (req, res, next) => {
  res.status(404).json({ message: "Invalid URL or Method" });
});
app.use(errorHandling_1.errorHandler);
exports.default = app;
