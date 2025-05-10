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
exports.deleteAccountByAdmin = exports.updatedUserByAdmin = exports.getallUser = exports.logout = exports.deleteAccount = exports.updateUser = exports.changePassword = exports.uploadImage = exports.profile = void 0;
const errorHandling_1 = require("./../../../utils/errorHandling");
const sanatize_data_1 = require("../../../utils/sanatize.data");
const user_model_1 = __importDefault(require("../../../DB/models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crpto_1 = require("../../../utils/crpto");
const cloudinary_1 = require("../../../utils/cloudinary");
const apiFeacture_1 = __importDefault(require("../../../utils/apiFeacture"));
const profile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        return next(new errorHandling_1.CustomError("user not found ERROR", 500));
    }
    return res.status(200).json({
        message: "user data fetched successfully",
        statusCode: 200,
        success: true,
        user: (0, sanatize_data_1.sanatizeUser)(user),
    });
});
exports.profile = profile;
const uploadImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const user = req === null || req === void 0 ? void 0 : req.user;
    if (!req.file) {
        return next(new errorHandling_1.CustomError("No file uploaded", 400));
    }
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    if (!userId) {
        return next(new errorHandling_1.CustomError("Unauthorized", 401));
    }
    let publicId, secure_url;
    if ((user === null || user === void 0 ? void 0 : user.image) && ((_b = user === null || user === void 0 ? void 0 : user.image) === null || _b === void 0 ? void 0 : _b.id) && ((_c = user === null || user === void 0 ? void 0 : user.image) === null || _c === void 0 ? void 0 : _c.url)) {
        publicId = (_d = user === null || user === void 0 ? void 0 : user.image) === null || _d === void 0 ? void 0 : _d.id;
        const { secure_url: newSecureUrl, public_id: newPublicId } = yield cloudinary_1.cloudinaryInstance.updateFile(publicId, req.file.path);
        secure_url = newSecureUrl;
        publicId = newPublicId;
    }
    else {
        const { secure_url: newSecureUrl, public_id: newPublicId } = yield cloudinary_1.cloudinaryInstance.uploadFile(req.file.path);
        secure_url = newSecureUrl;
        publicId = newPublicId;
    }
    const updateUser = yield user_model_1.default.findByIdAndUpdate(userId, { image: { id: publicId, url: secure_url } }, { new: true });
    if (!user) {
        return next(new errorHandling_1.CustomError("User not found", 404));
    }
    return res.status(200).json({
        message: "Image uploaded successfully",
        statusCode: 200,
        success: true,
        user: (0, sanatize_data_1.sanatizeUser)(updateUser),
    });
});
exports.uploadImage = uploadImage;
const changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { currentPassword, newPassword } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const user = yield user_model_1.default.findById(userId);
    if (!user) {
        return next(new errorHandling_1.CustomError("User not found", 404));
    }
    const isMatch = yield bcryptjs_1.default.compare(currentPassword, String(user.password));
    if (!isMatch) {
        return next(new errorHandling_1.CustomError("Current password is incorrect", 400));
    }
    const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 8);
    user.password = hashedPassword;
    yield user.save();
    res.status(200).json({
        message: "Password changed successfully",
        statusCode: 200,
        success: true,
    });
});
exports.changePassword = changePassword;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, phone } = req.body;
    const user = req.user;
    const encryptedPhone = phone
        ? (0, crpto_1.encrypt)(phone, String(process.env.SECRETKEY_CRYPTO))
        : undefined;
    const updateData = { firstName, lastName };
    if (encryptedPhone)
        updateData.phone = encryptedPhone;
    const updateUser = yield user_model_1.default.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user._id, updateData, {
        new: true,
    });
    if (!updateUser) {
        return next(new errorHandling_1.CustomError("User not found during update", 404));
    }
    return res.status(200).json({
        message: "User data updated successfully",
        statusCode: 200,
        success: true,
        user: (0, sanatize_data_1.sanatizeUser)(updateUser),
    });
});
exports.updateUser = updateUser;
const deleteAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    if (!userId) {
        return next(new errorHandling_1.CustomError("Unauthorized", 401));
    }
    if ((_b = req.user) === null || _b === void 0 ? void 0 : _b.image) {
        yield cloudinary_1.cloudinaryInstance.deleteFile((_d = (_c = req.user) === null || _c === void 0 ? void 0 : _c.image) === null || _d === void 0 ? void 0 : _d.id);
    }
    yield user_model_1.default.findByIdAndDelete(userId);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.status(200).json({
        message: "Account deleted successfully",
        statusCode: 200,
        success: true,
    });
});
exports.deleteAccount = deleteAccount;
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.status(200).json({
        message: "Logout successful",
        success: true,
        statusCode: 200,
    });
});
exports.logout = logout;
const allowSearchFields = ["firstName", "lastName", "email", "role", "phone"];
const defaultFields = [
    "firstName",
    "lastName",
    "email",
    "role",
    "phone",
    "isConfirmed",
    "image",
    "isBlocked",
    "isOnline",
];
const getallUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { page, size, search, sort, select, role, blocked, confirmed } = req.query;
    const pipeline = new apiFeacture_1.default()
        .addStage({ $match: { _id: { $ne: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id } } })
        .matchField("isBlocked", blocked == "yes" ? true : blocked == "no" ? false : undefined)
        .matchField("role", role)
        .matchField("isConfirmed", confirmed == "yes" ? true : confirmed == "no" ? false : undefined)
        .match({
        fields: allowSearchFields,
        search: (search === null || search === void 0 ? void 0 : search.toString()) || "",
        op: "$or",
    })
        .sort((sort === null || sort === void 0 ? void 0 : sort.toString()) || "")
        .paginate(Number(page) || 1, Number(size) || 100)
        .projection({
        allowFields: defaultFields,
        defaultFields: defaultFields,
        select: (select === null || select === void 0 ? void 0 : select.toString()) || "",
    })
        .build();
    const [total, users] = yield Promise.all([
        user_model_1.default.countDocuments().lean(),
        user_model_1.default.aggregate(pipeline).exec(),
    ]);
    // add image versions
    const updatedUsers = yield Promise.all(users.map((user) => __awaiter(void 0, void 0, void 0, function* () {
        if (user.image) {
            const versions = yield cloudinary_1.cloudinaryInstance.imageVersions(user.image.id);
            return Object.assign(Object.assign({}, user), { image: Object.assign(Object.assign({}, user.image), versions) });
        }
        return user;
    })));
    return res.status(200).json({
        message: "services fetched successfully",
        statusCode: 200,
        totalUsers: total,
        totalPages: Math.ceil(total / Number(size || 21)),
        success: true,
        users: updatedUsers,
    });
});
exports.getallUser = getallUser;
const updatedUserByAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const { role, block, confirm } = req.body;
    const user = yield user_model_1.default.findById(userId);
    if (!user) {
        return next(new errorHandling_1.CustomError("user not found", 400));
    }
    const updatedFields = {};
    if (role)
        updatedFields.role = role;
    if (block)
        block === "yes"
            ? (updatedFields.isBlocked = true)
            : (updatedFields.isBlocked = false);
    if (confirm)
        confirm === "yes"
            ? (updatedFields.isConfirmed = true)
            : (updatedFields.isConfirmed = false);
    const updatedUser = yield user_model_1.default.findByIdAndUpdate({ _id: userId }, updatedFields, { lean: true, new: true });
    if (!updatedUser) {
        return next(new errorHandling_1.CustomError("user not found", 400));
    }
    return res.status(200).json({
        message: "user updated successfully",
        statusCode: 200,
        success: true,
        user: updatedUser,
    });
});
exports.updatedUserByAdmin = updatedUserByAdmin;
const deleteAccountByAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const user = yield user_model_1.default.findById(userId);
    if (!user) {
        return next(new errorHandling_1.CustomError("user not found", 400));
    }
    yield user_model_1.default.findByIdAndDelete(userId);
    return res.status(200).json({
        message: "Account deleted successfully",
        statusCode: 200,
        success: true,
    });
});
exports.deleteAccountByAdmin = deleteAccountByAdmin;
