"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const crypto_js_1 = require("crypto-js");
const encrypt = (data, key) => {
    return crypto_js_1.AES.encrypt(data, key).toString();
};
exports.encrypt = encrypt;
const decrypt = (encryptedData, key) => {
    return crypto_js_1.AES.decrypt(encryptedData, key).toString(crypto_js_1.enc.Utf8);
};
exports.decrypt = decrypt;
