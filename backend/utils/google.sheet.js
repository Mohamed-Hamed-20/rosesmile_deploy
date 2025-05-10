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
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleSheetInstance = void 0;
const googleapis_1 = require("googleapis");
const env_1 = require("../config/env");
class GoogleSheetService {
    constructor() {
        this.auth = new googleapis_1.google.auth.JWT({
            email: env_1.GOOGLE_SHEET.CLIENT_EMAIL,
            key: env_1.GOOGLE_SHEET.PRIVATE_KEY,
            scopes: [
                'https://www.googleapis.com/auth/spreadsheets',
                'https://www.googleapis.com/auth/drive',
            ],
        });
        this.sheets = googleapis_1.google.sheets({ version: 'v4', auth: this.auth });
        this.drive = googleapis_1.google.drive({ version: 'v3', auth: this.auth });
    }
    createNewSheet(title) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Create a new spreadsheet
                const driveResponse = yield this.drive.files.create({
                    requestBody: {
                        name: title,
                        mimeType: 'application/vnd.google-apps.spreadsheet',
                    },
                });
                const fileId = driveResponse.data.id;
                if (!fileId) {
                    throw new Error('Failed to create spreadsheet: No file ID returned');
                }
                // Share the file with your email
                yield this.drive.permissions.create({
                    fileId: fileId,
                    requestBody: {
                        role: 'writer',
                        type: 'user',
                        emailAddress: 'nodemailert22@gmail.com',
                    },
                });
                console.log(driveResponse);
                return fileId;
            }
            catch (error) {
                console.error('Error creating Google Sheet:', error);
                throw error;
            }
        });
    }
    getAllSheets() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // List all spreadsheet files owned by the service account
                const response = yield this.drive.files.list({
                    q: "mimeType='application/vnd.google-apps.spreadsheet'",
                    fields: 'files(id, name, webViewLink, createdTime)',
                    orderBy: 'createdTime desc',
                });
                // Return the list of files
                return response.data.files;
            }
            catch (error) {
                console.error('Error fetching sheets:', error);
                throw error;
            }
        });
    }
    deleteSheet(spreadsheetId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Delete the spreadsheet
                yield this.drive.files.delete({
                    fileId: spreadsheetId,
                });
                console.log(`Spreadsheet with ID ${spreadsheetId} deleted successfully.`);
            }
            catch (error) {
                console.error(`Error deleting spreadsheet with ID ${spreadsheetId}:`, error);
                throw error;
            }
        });
    }
    addRow(spreadsheetId, rowIndex, rowData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const values = [Object === null || Object === void 0 ? void 0 : Object.values(rowData)];
            const response = yield this.sheets.spreadsheets.values.append({
                spreadsheetId,
                range: `Sheet1!A${rowIndex}:Z${rowIndex}`,
                valueInputOption: 'RAW',
                insertDataOption: 'INSERT_ROWS',
                requestBody: { values },
            });
            console.log(response);
            return {
                range: (_a = response.data.updates) === null || _a === void 0 ? void 0 : _a.updatedRange,
            };
        });
    }
    updateRow(spreadsheetId, range, rowData) {
        return __awaiter(this, void 0, void 0, function* () {
            const values = [Object === null || Object === void 0 ? void 0 : Object.values(rowData)];
            const response = yield this.sheets.spreadsheets.values.update({
                spreadsheetId,
                range: range,
                valueInputOption: 'RAW',
                requestBody: { values },
            });
            console.log(response);
            return {
                spreadsheetId,
            };
        });
    }
}
// Export a singleton instance
exports.googleSheetInstance = new GoogleSheetService();
