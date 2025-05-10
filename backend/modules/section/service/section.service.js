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
exports.deletesection = exports.updatesection = exports.searchsection = exports.getsectionById = exports.addsection = void 0;
const errorHandling_1 = require("../../../utils/errorHandling");
const cloudinary_1 = require("../../../utils/cloudinary");
const section_model_1 = __importDefault(require("../../../DB/models/section.model"));
const apiFeacture_1 = __importDefault(require("../../../utils/apiFeacture"));
const addsection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, subTitle, description, features } = req.body;
    console.log(req.body);
    if (!req.file) {
        return next(new errorHandling_1.CustomError("Image not provided", 400));
    }
    const section = new section_model_1.default({
        title,
        subTitle,
        description,
        features,
    });
    const response = yield cloudinary_1.cloudinaryInstance.uploadFile(req.file.path, `section/${section._id}`);
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
    const section = yield section_model_1.default
        .findById(id)
        .populate({
        path: "services",
        select: "title subTitle description features image -sectionId",
    })
        .lean();
    if (!section) {
        return next(new errorHandling_1.CustomError("section not found", 404));
    }
    const versions = yield cloudinary_1.cloudinaryInstance.imageVersions((_a = section.image) === null || _a === void 0 ? void 0 : _a.id);
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
const allowSearchFields = ["title", "subTitle"];
const defaultFields = [
    "title",
    "subTitle",
    "description",
    "features",
    "image",
    "createdAt",
    "updatedAt",
];
const searchsection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
    const [total, sections] = yield Promise.all([
        section_model_1.default.countDocuments().lean(),
        section_model_1.default.aggregate(pipeline).exec(),
    ]);
    // add image versions
    const updatedSections = yield Promise.all(sections.map((section) => __awaiter(void 0, void 0, void 0, function* () {
        if (section.image) {
            const versions = yield cloudinary_1.cloudinaryInstance.imageVersions(section.image.id);
            return Object.assign(Object.assign({}, section), { image: Object.assign(Object.assign({}, section.image), versions) });
        }
        return section;
    })));
    return res.status(200).json({
        message: "sections fetched successfully",
        statusCode: 200,
        totalsections: total,
        totalPages: Math.ceil(total / Number(size || 21)),
        success: true,
        sections: updatedSections,
    });
});
exports.searchsection = searchsection;
const updatesection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { sectionId } = req.query;
    const { title, subTitle, description, features } = req.body;
    const section = yield section_model_1.default.findById(sectionId);
    if (!section) {
        return next(new errorHandling_1.CustomError("section not found", 404));
    }
    const updatedFields = {};
    if (req.file) {
        const { secure_url, public_id } = yield cloudinary_1.cloudinaryInstance.updateFile(section.image.id, req.file.path);
        const image = {
            imageUrl: secure_url,
            id: public_id,
        };
        updatedFields.image = image;
    }
    if (title)
        updatedFields.title = title;
    if (subTitle)
        updatedFields.subTitle = subTitle;
    if (description)
        updatedFields.description = description;
    if (features)
        updatedFields.features = features;
    const updatedsection = yield section_model_1.default.findByIdAndUpdate(sectionId, { $set: updatedFields }, { new: true, runValidators: true });
    if (!updatedsection) {
        return next(new errorHandling_1.CustomError("Failed to update section", 500));
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
    if (section.image) {
        yield cloudinary_1.cloudinaryInstance.deleteFile(section.image.id).then((result) => {
            console.log("deleted successfully", result);
        });
    }
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
