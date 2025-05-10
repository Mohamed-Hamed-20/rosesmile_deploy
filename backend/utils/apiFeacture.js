"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginate = paginate;
const mongoose_1 = __importStar(require("mongoose"));
function paginate(page, size) {
    if (size > 23) {
        size = 23;
    }
    page = page && page > 0 ? page : 1;
    size = size && size > 0 ? size : 10;
    const skip = (page - 1) * size;
    return { limit: size, skip };
}
class ApiPipeline {
    constructor() {
        this.pipeline = [];
    }
    searchIds(field, ids) {
        if (field && ids) {
            this.pipeline.push({
                $match: {
                    [field]: {
                        $in: ids.map((id) => new mongoose_1.default.Types.ObjectId(id)),
                    },
                },
            });
        }
        return this;
    }
    match(params) {
        const { fields, search, op } = params;
        if (!search || search == "")
            return this;
        const searchQuery = fields.map((field) => ({
            [field]: { $regex: search, $options: "i" },
        }));
        this.pipeline.push({ $match: { [op]: searchQuery } });
        return this;
    }
    sort(sortText) {
        if (!sortText)
            return this;
        const sortFields = {};
        sortText.split(",").forEach((item) => {
            const [field, order] = item.split(":");
            sortFields[field.trim()] = order.trim().toLowerCase() === "desc" ? -1 : 1;
        });
        this.pipeline.push({ $sort: sortFields });
        return this;
    }
    matchId(params) {
        const { Id, field } = params;
        if (!Id || !mongoose_1.Types.ObjectId.isValid(Id)) {
            throw new Error("Invalid ObjectId");
        }
        this.pipeline.push({ $match: { [field]: new mongoose_1.Types.ObjectId(Id) } });
        return this;
    }
    searchOnString(field, searchValue) {
        if (!searchValue || !field) {
            return this;
        }
        console.log(searchValue);
        this.addStage({
            $match: {
                [field]: { $regex: searchValue, $options: "i" },
            },
        });
        return this;
    }
    lookUp(params, projectFields) {
        const lookupStage = {
            from: params.from,
            localField: params.localField,
            foreignField: params.foreignField,
            as: params.as,
        };
        // Build match stage (if any)
        let matchStage = {};
        if (params.matchFields) {
            matchStage = Object.assign({}, params.matchFields);
        }
        if (params.searchFields && params.searchTerm) {
            const searchConditions = params.searchFields.map((field) => ({
                [field]: { $regex: params.searchTerm, $options: "i" },
            }));
            if (matchStage.$or) {
                // Merge existing $or with new search conditions (optional case)
                matchStage.$and = [{ $or: matchStage.$or }, { $or: searchConditions }];
                delete matchStage.$or;
            }
            else {
                matchStage.$or = searchConditions;
            }
        }
        if (Object.keys(matchStage).length > 0) {
            lookupStage.pipeline = lookupStage.pipeline || [];
            lookupStage.pipeline.push({ $match: matchStage });
        }
        if (projectFields) {
            lookupStage.pipeline = lookupStage.pipeline || [];
            lookupStage.pipeline.push({ $project: projectFields });
        }
        this.pipeline.push({ $lookup: lookupStage });
        if (!params.isArray) {
            this.pipeline.push({
                $unwind: {
                    path: `$${params.as}`,
                    preserveNullAndEmptyArrays: true,
                },
            });
        }
        return this;
    }
    projection(params) {
        const { allowFields, select, defaultFields } = params;
        const selectedFields = select
            ? select.split(",").map((f) => f.trim())
            : defaultFields;
        const fieldWanted = selectedFields.filter((field) => allowFields.includes(field));
        if (fieldWanted.length > 0) {
            const projection = fieldWanted.reduce((acc, field) => {
                acc[field] = 1;
                return acc;
            }, {});
            this.pipeline.push({ $project: projection });
        }
        return this;
    }
    paginate(page, size) {
        const { limit, skip } = paginate(page, size);
        this.pipeline.push({ $skip: skip });
        this.pipeline.push({ $limit: limit });
        return this;
    }
    addStage(stage) {
        if (typeof stage !== "object" || Array.isArray(stage)) {
            throw new Error("Stage must be a valid object");
        }
        this.pipeline.push(stage);
        return this;
    }
    matchField(field, value) {
        if (field !== undefined && value !== undefined) {
            this.pipeline.push({
                $match: {
                    [field]: value,
                },
            });
        }
        return this;
    }
    build() {
        return this.pipeline;
    }
}
exports.default = ApiPipeline;
