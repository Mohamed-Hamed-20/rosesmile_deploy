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
exports.deleteOffer = exports.updateOfferImage = exports.updateOffer = exports.getOfferById = exports.getOffers = exports.createOffer = void 0;
const offers_model_1 = require("../../../DB/models/offers.model");
const errorHandling_1 = require("../../../utils/errorHandling");
const section_model_1 = __importDefault(require("../../../DB/models/section.model"));
const service_model_1 = __importDefault(require("../../../DB/models/service.model"));
const cloudinary_1 = require("../../../utils/cloudinary");
const apiFeacture_1 = __importDefault(require("../../../utils/apiFeacture"));
//create offer
const createOffer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, desc, type, display, reference } = req.body;
    if (!req.file) {
        return next(new errorHandling_1.CustomError("Please upload an image", 400));
    }
    if (type == "section") {
        const isValidReference = yield section_model_1.default.findById(reference);
        if (!isValidReference) {
            return next(new errorHandling_1.CustomError("section reference not found", 404));
        }
    }
    else {
        const isValidReference = yield service_model_1.default.findById(reference);
        if (!isValidReference) {
            return next(new errorHandling_1.CustomError("service reference not found", 404));
        }
    }
    const offerSchema = new offers_model_1.offerModel({
        title,
        desc,
        reference,
        display,
        type,
    });
    const { secure_url, public_id } = yield cloudinary_1.cloudinaryInstance.uploadFile(req.file.path, `offers/${offerSchema._id}`);
    offerSchema.image = { url: secure_url, id: public_id };
    const offer = yield offerSchema.save();
    if (!offer) {
        yield cloudinary_1.cloudinaryInstance.deleteFile(public_id);
        return next(new errorHandling_1.CustomError("Offer not created", 400));
    }
    return res.status(201).json({
        message: "Offer created successfully",
        success: true,
        statusCode: 201,
        offer,
    });
});
exports.createOffer = createOffer;
//allow search fields
const allowSearchFields = ["title", "desc"];
//default fields
const defaultFields = [
    "title",
    "desc",
    "image",
    "display",
    "type",
    "reference",
    "section",
    "service",
    "createdAt",
    "updatedAt",
];
//get all offers
const getOffers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, size, search, sort, select, display } = req.query;
    const pipeline = new apiFeacture_1.default()
        .matchField("display", display === "yes" ? true : display === "no" ? false : undefined)
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
    const [total, offers] = yield Promise.all([
        offers_model_1.offerModel.countDocuments().lean(),
        offers_model_1.offerModel.aggregate(pipeline).exec(),
    ]);
    // add image versions
    const updatedOffers = yield Promise.all(offers.map((offer) => __awaiter(void 0, void 0, void 0, function* () {
        if (offer.image) {
            const versions = yield cloudinary_1.cloudinaryInstance.imageVersions(offer.image.id);
            return Object.assign(Object.assign({}, offer), { image: Object.assign(Object.assign({}, offer.image), versions) });
        }
        return offer;
    })));
    return res.status(200).json({
        message: "offers fetched successfully",
        statusCode: 200,
        totalOffers: total,
        totalPages: Math.ceil(total / Number(size || 21)),
        success: true,
        offers: updatedOffers,
    });
});
exports.getOffers = getOffers;
//get offer by id
const getOfferById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const offer = yield offers_model_1.offerModel.findById(id);
    if (!offer) {
        return next(new errorHandling_1.CustomError("Offer not found", 404));
    }
    const versions = yield cloudinary_1.cloudinaryInstance.imageVersions((_a = offer.image) === null || _a === void 0 ? void 0 : _a.id);
    offer.image = Object.assign(Object.assign({}, offer.image), versions);
    return res.status(200).json({
        message: "Offer fetched successfully",
        success: true,
        statusCode: 200,
        offer,
    });
});
exports.getOfferById = getOfferById;
//update offer
const updateOffer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, desc, display, type, reference } = req.body;
    const offer = yield offers_model_1.offerModel.findById(id);
    if (!offer) {
        return next(new errorHandling_1.CustomError("Offer not found", 404));
    }
    const updateFeilds = {};
    if (title)
        updateFeilds.title = title;
    if (desc)
        updateFeilds.desc = desc;
    if (display !== undefined)
        updateFeilds.display = display;
    if (reference && offer.reference.toString() !== reference.toString()) {
        //update reference
        if (!type)
            return next(new errorHandling_1.CustomError("type is required", 400));
        if (type == "section") {
            const isValidReference = yield section_model_1.default.findById(reference);
            if (!isValidReference) {
                return next(new errorHandling_1.CustomError("section reference not found", 404));
            }
        }
        else {
            const isValidReference = yield service_model_1.default.findById(reference);
            if (!isValidReference) {
                return next(new errorHandling_1.CustomError("service reference not found", 404));
            }
        }
        updateFeilds.type = type;
        updateFeilds.reference = reference;
    }
    const updatedOffer = yield offers_model_1.offerModel.findByIdAndUpdate(id, updateFeilds, {
        new: true,
        lean: true,
    });
    return res.status(200).json({
        message: "Offer updated successfully",
        success: true,
        statusCode: 200,
        offer: updatedOffer,
    });
});
exports.updateOffer = updateOffer;
//update offer image
const updateOfferImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    if (!req.file) {
        return next(new errorHandling_1.CustomError("Please upload an image", 400));
    }
    const offer = yield offers_model_1.offerModel.findById(id);
    if (!offer) {
        return next(new errorHandling_1.CustomError("Offer not found", 404));
    }
    const { secure_url, public_id } = yield cloudinary_1.cloudinaryInstance.updateFile((_a = offer.image) === null || _a === void 0 ? void 0 : _a.id, req.file.path);
    const updatedOffer = yield offers_model_1.offerModel.findByIdAndUpdate(id, {
        image: {
            url: secure_url,
            id: public_id,
        },
    });
    return res.status(200).json({
        message: "Offer image updated successfully",
        success: true,
        statusCode: 200,
        offer: updatedOffer,
    });
});
exports.updateOfferImage = updateOfferImage;
//delete offer
const deleteOffer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const offer = yield offers_model_1.offerModel.findByIdAndDelete(id);
    if (!offer) {
        return next(new errorHandling_1.CustomError("Offer not found", 404));
    }
    yield cloudinary_1.cloudinaryInstance.deleteFile((_a = offer.image) === null || _a === void 0 ? void 0 : _a.id);
    return res.status(200).json({
        message: "Offer deleted successfully",
        success: true,
        statusCode: 200,
        offer,
    });
});
exports.deleteOffer = deleteOffer;
