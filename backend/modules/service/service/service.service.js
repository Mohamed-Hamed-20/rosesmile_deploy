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
exports.getServices = exports.deleteService = exports.updateServiceImage = exports.updateService = exports.getServiceById = exports.createService = void 0;
const service_model_1 = __importDefault(require("../../../DB/models/service.model"));
const errorHandling_1 = require("../../../utils/errorHandling");
const cloudinary_1 = require("../../../utils/cloudinary");
const section_model_1 = __importDefault(require("../../../DB/models/section.model"));
const apiFeacture_1 = __importDefault(require("../../../utils/apiFeacture"));
const createService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, subTitle, description, features, sectionId } = req.body;
    if (!(req === null || req === void 0 ? void 0 : req.file)) {
        return next(new errorHandling_1.CustomError("No files uploaded", 400));
    }
    const section = yield section_model_1.default.findById(sectionId).lean().select("_id");
    if (!section)
        return next(new errorHandling_1.CustomError("Section not found", 404));
    const service = new service_model_1.default({
        title,
        subTitle,
        description,
        features,
        sectionId: section._id,
    });
    const { secure_url, public_id } = yield cloudinary_1.cloudinaryInstance.uploadFile(req.file.path, `service/${service._id}`);
    service.image = { url: secure_url, id: public_id };
    const savedService = yield service.save();
    if (!savedService) {
        yield cloudinary_1.cloudinaryInstance.deleteFile(public_id);
        return next(new errorHandling_1.CustomError("Failed to create service", 500));
    }
    return res.status(201).json({
        message: "Service created successfully",
        success: true,
        statusCode: 201,
        service: savedService,
    });
});
exports.createService = createService;
const getServiceById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const service = yield service_model_1.default
        .findById(id)
        .populate({
        path: "sectionId",
        select: "_id title subTitle description features image",
    })
        .lean();
    // if service not found
    if (!service)
        return next(new errorHandling_1.CustomError("Service not found", 404));
    const versions = yield cloudinary_1.cloudinaryInstance.imageVersions((_a = service.image) === null || _a === void 0 ? void 0 : _a.id);
    service.image = Object.assign(Object.assign({}, service.image), versions);
    //response
    res.status(200).json({
        message: "Service fetched successfully",
        success: true,
        statusCode: 200,
        service,
    });
});
exports.getServiceById = getServiceById;
const updateService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, subTitle, description, features, sectionId } = req.body;
    const findService = yield service_model_1.default.findById(id);
    // if service not found
    if (!findService)
        return next(new errorHandling_1.CustomError("Service not found", 404));
    // update data
    const updateData = {};
    if (title)
        updateData.title = title;
    if (subTitle)
        updateData.subTitle = subTitle;
    if (description && description.length > 0)
        updateData.description = description;
    if (features && features.length > 0)
        updateData.features = features;
    if (sectionId && sectionId.toString() !== findService.sectionId.toString()) {
        const findSection = yield section_model_1.default.findById(sectionId);
        if (!findSection)
            return next(new errorHandling_1.CustomError("Section not found", 404));
        updateData.sectionId = sectionId;
    }
    // update service
    const service = yield service_model_1.default.findByIdAndUpdate(id, updateData, {
        new: true,
        lean: true,
    });
    // response
    return res.status(200).json({
        message: "Service updated successfully",
        success: true,
        statusCode: 200,
        service,
    });
});
exports.updateService = updateService;
const updateServiceImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    if (!(req === null || req === void 0 ? void 0 : req.file)) {
        return next(new errorHandling_1.CustomError("No file uploaded", 400));
    }
    const findService = yield service_model_1.default.findById(id);
    if (!findService)
        return next(new errorHandling_1.CustomError("Service not found", 404));
    const { secure_url, public_id } = yield cloudinary_1.cloudinaryInstance.updateFile(findService.image.id, (_a = req.file) === null || _a === void 0 ? void 0 : _a.path);
    findService.image = { url: secure_url, id: public_id };
    yield findService.save();
    return res.status(200).json({
        message: "Service image updated successfully",
        success: true,
        statusCode: 200,
        service: findService,
    });
});
exports.updateServiceImage = updateServiceImage;
const deleteService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const service = yield service_model_1.default.findByIdAndDelete(id);
    if (!service) {
        return next(new errorHandling_1.CustomError("Service not found", 404));
    }
    yield cloudinary_1.cloudinaryInstance.deleteFile(service.image.id);
    return res.status(200).json({
        message: "Service deleted successfully",
        success: true,
        statusCode: 200,
    });
});
exports.deleteService = deleteService;
// search in sections
const allowSearchFields = ["title", "subTitle"];
const defaultFields = [
    "title",
    "subTitle",
    "description",
    "features",
    "image",
    "section",
    "createdAt",
    "updatedAt",
];
const getServices = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, size, search, sort, select, sectionIds } = req.query;
    const pipeline = new apiFeacture_1.default()
        .searchIds("sectionId", sectionIds)
        .match({
        fields: allowSearchFields,
        search: (search === null || search === void 0 ? void 0 : search.toString()) || "",
        op: "$or",
    })
        .sort((sort === null || sort === void 0 ? void 0 : sort.toString()) || "")
        .paginate(Number(page) || 1, Number(size) || 100)
        .lookUp({
        from: "sections",
        localField: "sectionId",
        foreignField: "_id",
        as: "section",
        isArray: false,
    }, {
        title: 1,
        subTitle: 1,
        image: 1,
    })
        .projection({
        allowFields: defaultFields,
        defaultFields: defaultFields,
        select: (select === null || select === void 0 ? void 0 : select.toString()) || "",
    })
        .build();
    const [total, services] = yield Promise.all([
        service_model_1.default.countDocuments().lean(),
        service_model_1.default.aggregate(pipeline).exec(),
    ]);
    // add image versions
    const updatedServices = yield Promise.all(services.map((service) => __awaiter(void 0, void 0, void 0, function* () {
        if (service.image) {
            const versions = yield cloudinary_1.cloudinaryInstance.imageVersions(service.image.id);
            return Object.assign(Object.assign({}, service), { image: Object.assign(Object.assign({}, service.image), versions) });
        }
        return service;
    })));
    return res.status(200).json({
        message: "services fetched successfully",
        statusCode: 200,
        totalServices: total,
        totalPages: Math.ceil(total / Number(size || 21)),
        success: true,
        services: updatedServices,
    });
});
exports.getServices = getServices;
// export const addNewImagesService = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { id } = req.params;
//   // check if files are uploaded
//   if (!req?.files) {
//     return next(new CustomError("No files uploaded", 400));
//   }
//   // find service
//   const findService = await serviceModel.findById(id);
//   if (!findService) return next(new CustomError("Service not found", 404));
//   // upload files to cloudinary
//   const imagesPromises = (req.files as Express.Multer.File[]).map((file) => {
//     return cloudinaryInstance.uploadFile(
//       file.path,
//       `service/${findService._id}`
//     );
//   });
//   // get responses
//   const responses: CloudinaryResponse[] = await Promise.all(imagesPromises);
//   const newImages = responses.map((response: CloudinaryResponse) => {
//     return {
//       url: response.secure_url,
//       id: response.public_id,
//     };
//   });
//   // update service
//   const updateService = await serviceModel.findByIdAndUpdate(
//     id,
//     {
//       $push: {
//         images: { $each: newImages },
//       },
//     },
//     {
//       new: true,
//       lean: true,
//     }
//   );
//   // response
//   return res.status(200).json({
//     message: "Images added successfully",
//     success: true,
//     statusCode: 200,
//     service: updateService,
//   });
// };
// export const updateServiceImage = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { id } = req.params;
//   const { imageId } = req.body;
//   if (!req?.file) {
//     return next(new CustomError("No file uploaded", 400));
//   }
//   const findService = await serviceModel.findById(id);
//   if (!findService) return next(new CustomError("Service not found", 404));
//   // upload file to cloudinary
//   const response = await cloudinaryInstance.updateFile(
//     imageId,
//     req.file.path
//   );
//   const newImage = {
//     url: response.secure_url,
//     id: response.public_id,
//   };
//   // update images
//   const updateService = await serviceModel.updateOne(
//     {
//       _id: id,
//       "images.id": newImage.id,
//     },
//     {
//       $set: {
//         "images.$.url": newImage.url,
//       },
//     }
//   );
//   // response
//   return res.status(200).json({
//     message: "Image updated successfully",
//     success: true,
//     statusCode: 200,
//     service: updateService,
//   });
// };
// export const deleteServiceImage = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { id } = req.params;
//   const { imageIds } = req.body;
//   if (!req?.files) {
//     return next(new CustomError("No files uploaded", 400));
//   }
//   const findService = await serviceModel.findById(id);
//   if (!findService) return next(new CustomError("Service not found", 404));
//   // delete images
//   const deleteImages = await cloudinaryInstance.deleteMultipleFiles(
//     imageIds
//   );
//   if (!deleteImages)
//     return next(new CustomError("Failed to delete images", 500));
//   // update images
//   const updateService = await serviceModel.updateOne(
//     {
//       _id: id,
//       "images.id": { $in: imageIds },
//     },
//     {
//       $pull: {
//         images: { id: { $in: imageIds } },
//       },
//     }
//   );
//   // response
//   return res.status(200).json({
//     message: "Image deleted successfully",
//     success: true,
//     statusCode: 200,
//     service: updateService,
//   });
// };
