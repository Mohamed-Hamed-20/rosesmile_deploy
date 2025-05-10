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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletesection = exports.updatesection = exports.searchsection = exports.getsectionById = exports.addsection = void 0;
const errorHandling_1 = require("../../../utils/errorHandling");
const cloudinary_1 = require("../../../utils/cloudinary");
const section_model_1 = __importDefault(require("../../../DB/models/section.model"));
const apiFeacture_1 = __importDefault(require("../../../utils/apiFeacture"));
const addsection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, desc } = req.body;
    if (!req.file) {
        return next(new errorHandling_1.CustomError("Image not provided", 400));
    }
    const section = new section_model_1.default({
        title,
        desc,
    });
    const response = yield new cloudinary_1.CloudinaryService().uploadFile(req.file.path, `section/${section._id}`);
    if (!response) {
        return next(new errorHandling_1.CustomError("Failed to upload image", 500));
    }
    section.image.imageUrl = response.secure_url;
    section.image.id = response.public_id;
    // Save the section to the database
    yield section.save();
    return res.status(201).json({
        message: "section created successfully",
        section,
    });
});
exports.addsection = addsection;
const getsectionById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const section = yield section_model_1.default.findById(id).lean();
    if (!section) {
        return next(new errorHandling_1.CustomError("section not found", 404));
    }
    const versions = yield new cloudinary_1.CloudinaryService().imageVersions((_a = section.image) === null || _a === void 0 ? void 0 : _a.id);
    section.image = Object.assign(Object.assign({}, section.image), versions);
    return res.status(200).json({
        message: "section fetched successfully",
        statusCode: 200,
        success: true,
        section,
    });
});
exports.getsectionById = getsectionById;
// search in sections
const allowSearchFields = ["title", "desc"];
const defaultFields = ["title", "desc", "image"];
const searchsection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    var _d;
    const { page, size, search, sort, select } = req.query;
    const pipeline = new apiFeacture_1.default()
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
    const [total, categories] = yield Promise.all([
        section_model_1.default.countDocuments().lean(),
        section_model_1.default.aggregate(pipeline).exec(),
    ]);
    try {
        // add image versions
        for (var _e = true, categories_1 = __asyncValues(categories), categories_1_1; categories_1_1 = yield categories_1.next(), _a = categories_1_1.done, !_a; _e = true) {
            _c = categories_1_1.value;
            _e = false;
            const section = _c;
            if (section.image) {
                const versions = yield new cloudinary_1.CloudinaryService().imageVersions((_d = section.image) === null || _d === void 0 ? void 0 : _d.id);
                section.image = Object.assign(Object.assign({}, section.image), versions);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_e && !_a && (_b = categories_1.return)) yield _b.call(categories_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return res.status(200).json({
        message: "categories fetched successfully",
        statusCode: 200,
        totalcategories: total,
        totalPages: Math.ceil(total / Number(size || 21)),
        success: true,
        categories: categories,
    });
});
exports.searchsection = searchsection;
const updatesection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { sectionId } = req.query;
    const { title, desc } = req.body;
    if (!title && !desc && !req.file) {
        return next(new errorHandling_1.CustomError("No fields provided to update", 400));
    }
    const updatedFields = {};
    if (req.file) {
        const section = yield section_model_1.default.findById(sectionId).lean();
        if (!section) {
            return next(new errorHandling_1.CustomError("section not found", 404));
        }
        const { metadata, secure_url, public_id } = yield new cloudinary_1.CloudinaryService().updateFile(section.image.id, req.file.path);
        const image = {};
        image.imageUrl = secure_url;
        image.id = public_id;
        updatedFields.image = image;
    }
    if (title)
        updatedFields.title = title;
    if (desc)
        updatedFields.desc = desc;
    const updatedsection = yield section_model_1.default.findByIdAndUpdate(sectionId, { $set: updatedFields }, { new: true, runValidators: true });
    if (!updatedsection) {
        return next(new errorHandling_1.CustomError("section not found", 404));
    }
    return res.status(200).json({
        message: "section updated successfully",
        statusCode: 200,
        success: true,
        section: updatedsection,
    });
});
exports.updatesection = updatesection;
const deletesection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const section = yield section_model_1.default.findByIdAndDelete({ _id: id }, { new: true });
    if (!section) {
        return next(new errorHandling_1.CustomError("section not found", 404));
    }
    new cloudinary_1.CloudinaryService().deleteFile(section.image.id).then((result) => {
        console.log("deleted successfully", result);
    });
    return res.status(200).json({
        message: "section deleted successfully",
        statusCode: 200,
        success: true,
        section,
    });
});
exports.deletesection = deletesection;
// export const ------ = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {};
