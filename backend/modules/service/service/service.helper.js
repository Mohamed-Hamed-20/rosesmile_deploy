"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compareArrays = (arr1, arr2) => {
    return arr1.every((id) => arr2.includes(id));
};
exports.default = compareArrays;
