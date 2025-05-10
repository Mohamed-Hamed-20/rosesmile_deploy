"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_controller_1 = __importDefault(require("./app.controller"));
const database_1 = require("./DB/database");
const env_1 = require("./config/env");
const port = env_1.PORT;
// Start the server after database connection
database_1.database
    .connect()
    .then(() => {
    app_controller_1.default.listen(port, () => console.log(`Server is running on port ${port}!`));
})
    .catch((err) => {
    console.error("Database connection failed:", err.message);
});
