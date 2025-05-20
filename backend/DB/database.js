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
exports.database = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("../config/env");
class Database {
    constructor() {
        this.isConnected = false;
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isConnected) {
                console.log("DB is Already Connected");
                return;
            }
            const uri = `${env_1.databaseConfigration.DB_URL}`;
            const options = {
                serverSelectionTimeoutMS: 15000,
            };
            try {
                const connection = yield mongoose_1.default.connect(uri, options);
                this.isConnected = connection.connection.readyState === 1;
                console.log("Database connected :)");
            }
            catch (error) {
                console.log("ERROR IN CONNECTION :(", (error === null || error === void 0 ? void 0 : error.message) || error);
            }
        });
    }
}
exports.database = Database.getInstance();
