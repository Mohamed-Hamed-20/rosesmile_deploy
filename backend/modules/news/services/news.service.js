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
exports.deleteNews = exports.updateNewsImage = exports.updateNews = exports.getNewsById = exports.getNews = exports.createNews = void 0;
const news_model_1 = __importDefault(require("../../../DB/models/news.model"));
const service_model_1 = __importDefault(require("../../../DB/models/service.model"));
const errorHandling_1 = require("../../../utils/errorHandling");
const cloudinary_1 = require("../../../utils/cloudinary");
const apiFeacture_1 = __importDefault(require("../../../utils/apiFeacture"));
const createNews = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, subTitle, desc, serviceId } = req.body;
    if (!req.file) {
        return next(new errorHandling_1.CustomError("Image is required", 400));
    }
    const service = yield service_model_1.default.findById(serviceId);
    if (!service) {
        return next(new errorHandling_1.CustomError("Service not found", 404));
    }
    const news = new news_model_1.default({
        title,
        subTitle,
        desc,
        serviceId,
    });
    const { secure_url, public_id } = yield cloudinary_1.cloudinaryInstance.uploadFile(req.file.path, `news/${news._id}`);
    news.image = {
        url: secure_url,
        id: public_id,
    };
    const savedNews = yield news.save();
    if (!savedNews) {
        yield cloudinary_1.cloudinaryInstance.deleteFile(public_id);
        return next(new errorHandling_1.CustomError("Failed to create news", 500));
    }
    return res.status(201).json({
        message: "News created successfully",
        statusCode: 201,
        success: true,
        data: savedNews,
    });
});
exports.createNews = createNews;
// search in news
const allowSearchFields = ["title", "subTitle", "desc"];
const defaultFields = [
    "title",
    "subTitle",
    "desc",
    "image",
    "service",
    "createdAt",
    "updatedAt",
];
const getNews = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const pipeline = new apiFeacture_1.default()
        .match({
        fields: allowSearchFields,
        search: req.query.search,
        op: "$or",
    })
        .sort(req.query.sort)
        .paginate(Number(req.query.page), Number(req.query.size))
        .lookUp({
        from: "services",
        localField: "serviceId",
        foreignField: "_id",
        as: "service",
    }, {
        title: 1,
        subTitle: 1,
        desc: 1,
        image: 1,
    })
        .projection({
        allowFields: defaultFields,
        defaultFields: defaultFields,
        select: ((_a = req.query.select) === null || _a === void 0 ? void 0 : _a.toString()) || "",
    })
        .build();
    const news = yield news_model_1.default.aggregate(pipeline);
    if (!news) {
        return next(new errorHandling_1.CustomError("News not found", 404));
    }
    const updatedNews = yield Promise.all(news.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const updatedItem = Object.assign({}, item);
        if (item.image) {
            const versions = yield cloudinary_1.cloudinaryInstance.imageVersions(item.image.id);
            updatedItem.image = Object.assign(Object.assign({}, item.image), versions);
        }
        if ((_a = item.service) === null || _a === void 0 ? void 0 : _a.image) {
            const serviceVersions = yield cloudinary_1.cloudinaryInstance.imageVersions(item.service.image.id);
            updatedItem.service = Object.assign(Object.assign({}, item.service), { image: Object.assign(Object.assign({}, item.service.image), serviceVersions) });
        }
        return updatedItem;
    })));
    return res.status(200).json({
        message: "News fetched successfully",
        statusCode: 200,
        success: true,
        data: updatedNews,
    });
});
exports.getNews = getNews;
const getNewsById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { id } = req.params;
    const news = yield news_model_1.default
        .findById(id)
        .populate({
        path: "serviceId",
        select: "title subTitle image createdAt updatedAt",
    })
        .lean();
    if (!news) {
        return next(new errorHandling_1.CustomError("News not found", 404));
    }
    const [newsVersionsImg, serviceVersionsImg] = yield Promise.all([
        cloudinary_1.cloudinaryInstance.imageVersions(news.image.id),
        cloudinary_1.cloudinaryInstance.imageVersions((_b = (_a = news.serviceId) === null || _a === void 0 ? void 0 : _a.image) === null || _b === void 0 ? void 0 : _b.id),
    ]);
    const updatedNews = Object.assign(Object.assign({}, news), { image: newsVersionsImg, service: Object.assign(Object.assign({}, news.serviceId), { image: serviceVersionsImg }) });
    delete updatedNews.serviceId;
    return res.status(200).json({
        message: "News fetched successfully",
        statusCode: 200,
        success: true,
        data: updatedNews,
    });
});
exports.getNewsById = getNewsById;
const updateNews = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, subTitle, desc, serviceId } = req.body;
    const updateFields = {};
    if (title)
        updateFields.title = title;
    if (subTitle)
        updateFields.subTitle = subTitle;
    if (desc)
        updateFields.desc = desc;
    if (serviceId) {
        const service = yield service_model_1.default.findById(serviceId);
        if (!service) {
            return next(new errorHandling_1.CustomError("Service not found", 404));
        }
        updateFields.serviceId = serviceId;
    }
    const news = yield news_model_1.default.findByIdAndUpdate(id, updateFields, {
        new: true,
    });
    if (!news) {
        return next(new errorHandling_1.CustomError("News not found", 404));
    }
    return res.status(200).json({
        message: "News updated successfully",
        statusCode: 200,
        success: true,
        data: news,
    });
});
exports.updateNews = updateNews;
const updateNewsImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!req.file) {
        return next(new errorHandling_1.CustomError("Image is required", 400));
    }
    const news = yield news_model_1.default.findById(id);
    if (!news) {
        return next(new errorHandling_1.CustomError("News not found", 404));
    }
    const { secure_url, public_id } = yield cloudinary_1.cloudinaryInstance.updateFile(news.image.id, req.file.path);
    news.image = {
        url: secure_url,
        id: public_id,
    };
    yield news.save();
    return res.status(200).json({
        message: "News image updated successfully",
        statusCode: 200,
        success: true,
        data: news,
    });
});
exports.updateNewsImage = updateNewsImage;
const deleteNews = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const news = yield news_model_1.default.findById(id);
    if (!news) {
        return next(new errorHandling_1.CustomError("News not found", 404));
    }
    const [deletedNews, deletedImage] = yield Promise.all([
        news_model_1.default.findByIdAndDelete(id),
        cloudinary_1.cloudinaryInstance.deleteFile(news.image.id),
    ]);
    if (!deletedNews || !deletedImage) {
        return next(new errorHandling_1.CustomError("Failed to delete news", 500));
    }
    return res.status(200).json({
        message: "News deleted successfully",
        statusCode: 200,
        success: true,
    });
});
exports.deleteNews = deleteNews;
