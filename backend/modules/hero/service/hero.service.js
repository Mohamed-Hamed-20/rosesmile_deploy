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
exports.getAllHero = exports.getHero = exports.deleteHero = exports.updateHero = exports.addHero = void 0;
const hero_model_1 = __importDefault(require("../../../DB/models/hero.model"));
const errorHandling_1 = require("../../../utils/errorHandling");
const cloudinary_1 = require("../../../utils/cloudinary");
const apiFeacture_1 = require("../../../utils/apiFeacture");
const redis_1 = __importDefault(require("../../../utils/redis"));
const addHero = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, subtitle, buttonText, buttonLink } = req.body;
    if (!req.file) {
        return new errorHandling_1.CustomError("Image file is not provided", 400);
    }
    const sizeHero = yield hero_model_1.default.countDocuments();
    if (sizeHero >= 12) {
        return new errorHandling_1.CustomError("You can only add 12 heroes for website", 400);
    }
    const { secure_url, public_id } = yield cloudinary_1.cloudinaryInstance.uploadFile(req.file.path, "hero");
    const hero = yield hero_model_1.default.create({
        title,
        subtitle,
        image: { url: secure_url, id: public_id },
        buttonText,
        buttonLink,
    });
    redis_1.default.del("heroes").then(() => {
        console.log("Heroes cache deleted");
    });
    return res.status(201).json({
        message: "Hero created successfully",
        success: true,
        statusCode: 201,
        hero,
    });
});
exports.addHero = addHero;
const updateHero = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, subtitle, image, buttonText, buttonLink } = req.body;
    const findhero = yield hero_model_1.default.findById(id);
    if (!findhero) {
        return new errorHandling_1.CustomError("Hero not found", 404);
    }
    const updatefields = {};
    if (title)
        updatefields.title = title;
    if (subtitle)
        updatefields.subtitle = subtitle;
    if (buttonText)
        updatefields.buttonText = buttonText;
    if (buttonLink)
        updatefields.buttonLink = buttonLink;
    if (req.file) {
        const { secure_url, public_id } = yield cloudinary_1.cloudinaryInstance.updateFile(findhero.image.id, req.file.path);
        updatefields.image = { url: secure_url, id: public_id };
    }
    const hero = yield hero_model_1.default.findByIdAndUpdate(id, updatefields, {
        new: true,
    });
    redis_1.default.del("heroes").then(() => {
        console.log("Heroes cache deleted");
    });
    return res.status(200).json({
        message: "Hero updated successfully",
        success: true,
        statusCode: 200,
        hero,
    });
});
exports.updateHero = updateHero;
const deleteHero = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const hero = yield hero_model_1.default.findById(id);
    if (!hero) {
        return new errorHandling_1.CustomError("Hero not found", 404);
    }
    if (hero.image.id) {
        console.log(hero.image.id);
        yield cloudinary_1.cloudinaryInstance.deleteFile(hero.image.id);
    }
    const deletedHero = yield hero_model_1.default.findByIdAndDelete(id);
    if (!deletedHero) {
        return new errorHandling_1.CustomError("server Error try again later", 500);
    }
    redis_1.default.del("heroes").then(() => {
        console.log("Heroes cache deleted");
    });
    return res.status(200).json({
        message: "Hero deleted successfully",
        success: true,
        statusCode: 200,
        deletedHero,
    });
});
exports.deleteHero = deleteHero;
const getHero = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const hero = yield hero_model_1.default.findById(id);
    if (!hero) {
        return new errorHandling_1.CustomError("Hero not found", 404);
    }
    return res.status(200).json({
        message: "Hero fetched successfully",
        success: true,
        statusCode: 200,
        hero,
    });
});
exports.getHero = getHero;
const getAllHero = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, skip } = (0, apiFeacture_1.paginate)(Number(req.query.page), Number(req.query.size));
    const cachedHeroes = yield redis_1.default.get("heroes");
    if (cachedHeroes) {
        return res.status(200).json({
            message: "Heroes fetched successfully",
            success: true,
            statusCode: 200,
            heroes: JSON.parse(cachedHeroes),
        });
    }
    const heroes = yield hero_model_1.default.find().skip(skip).limit(limit).lean();
    const updatedheroes = yield Promise.all(heroes.map((hero) => __awaiter(void 0, void 0, void 0, function* () {
        if (hero.image) {
            const versions = yield cloudinary_1.cloudinaryInstance.imageVersions(hero.image.id);
            return Object.assign(Object.assign({}, hero), { image: Object.assign(Object.assign({}, hero.image), versions) });
        }
        return heroes;
    })));
    if (heroes.length > 0) {
        yield redis_1.default.set("heroes", JSON.stringify(updatedheroes));
    }
    res.status(200).json({
        message: "Heroes fetched successfully",
        success: true,
        statusCode: 200,
        heroes: updatedheroes,
    });
});
exports.getAllHero = getAllHero;
