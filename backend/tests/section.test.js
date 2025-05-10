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
const supertest_1 = __importDefault(require("supertest"));
const app_controller_1 = __importDefault(require("../app.controller"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
/**
 * Section API Test Suite
 *
 * This test suite covers all CRUD operations for the section module,
 * including image uploads and search functionality.
 */
let createdId = null;
let cookies;
// Sample image path for testing
const testImagePath = path_1.default.join(process.cwd(), "src", "tests", "test.jpg");
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    // Connect to test database
    yield mongoose_1.default.connect(process.env.TEST_DB_URI);
    // Login and get cookies before all tests
    const loginRes = yield (0, supertest_1.default)(app_controller_1.default).post("/api/v1/auth/login").send({
        email: "mh674281@gmail.com",
        password: "MH2020salah",
    });
    if (loginRes.status !== 200 || !loginRes.headers["set-cookie"]) {
        throw new Error("Failed to login: " + JSON.stringify(loginRes.body));
    }
    // Store cookies from response
    cookies = loginRes.headers["set-cookie"];
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    // Clean up test data
    if (createdId) {
        try {
            yield (0, supertest_1.default)(app_controller_1.default)
                .delete(`/api/v1/section/${createdId}`)
                .set("Cookie", cookies);
        }
        catch (error) {
            console.log("Error cleaning up test section:", error);
        }
    }
    // Disconnect from database
    yield mongoose_1.default.disconnect();
}));
describe("Section API Tests", () => {
    // Test section creation
    describe("Create Section", () => {
        it("should create a new section with all required fields", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_controller_1.default)
                .post("/api/v1/section/add")
                .set("Cookie", cookies)
                .attach("image", testImagePath)
                .field("title", "test section")
                .field("subTitle", "test subtitle")
                .field("description", "test description")
                .field("features", "test feature");
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty("section");
            expect(res.body.section).toHaveProperty("_id");
            expect(res.body.section.title).toBe("test section");
            expect(res.body.section.subTitle).toBe("test subtitle");
            expect(res.body.section.description).toBe("test description");
            expect(res.body.section.features).toBe("test feature");
            expect(res.body.section.image).toHaveProperty("imageUrl");
            createdId = res.body.section._id;
        }));
        it("should create a new section with array of descriptions and features", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_controller_1.default)
                .post("/api/v1/section/add")
                .set("Cookie", cookies)
                .attach("image", testImagePath)
                .field("title", "test section")
                .field("subTitle", "test subtitle")
                .field("description", ["desc1", "desc2"])
                .field("features", ["feature1", "feature2"]);
            expect(res.status).toBe(201);
            expect(res.body.section.description).toEqual(["desc1", "desc2"]);
            expect(res.body.section.features).toEqual(["feature1", "feature2"]);
        }));
        it("should fail to create section without required fields", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_controller_1.default)
                .post("/api/v1/section/add")
                .set("Cookie", cookies)
                .send({
                title: "test section",
            });
            expect(res.status).toBe(400);
        }));
    });
    // Test section retrieval
    describe("Get Section", () => {
        it("should get section by ID", () => __awaiter(void 0, void 0, void 0, function* () {
            if (!createdId) {
                throw new Error("No section ID available for testing");
            }
            const res = yield (0, supertest_1.default)(app_controller_1.default)
                .get(`/api/v1/section/${createdId}`)
                .set("Cookie", cookies);
            expect(res.status).toBe(200);
            expect(res.body.section._id).toBe(createdId);
            expect(res.body.section.title).toBe("test section");
        }));
        it("should return 404 for non-existent section", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_controller_1.default)
                .get("/api/v1/section/6802624a669ef3d4c51ddbef")
                .set("Cookie", cookies);
            expect(res.status).toBe(404);
        }));
    });
    // Test section search
    describe("Search Sections", () => {
        it("should search sections with pagination and sorting", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_controller_1.default)
                .get("/api/v1/section?page=1&size=10&search=test&sort=-createdAt")
                .set("Cookie", cookies);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("sections");
            expect(Array.isArray(res.body.sections)).toBe(true);
            expect(res.body).toHaveProperty("totalPages");
            expect(res.body).toHaveProperty("totalsections");
        }));
        it("should search sections with select fields", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_controller_1.default)
                .get("/api/v1/section?select=title,subTitle")
                .set("Cookie", cookies);
            expect(res.status).toBe(200);
            expect(res.body.sections[0]).toHaveProperty("title");
            expect(res.body.sections[0]).toHaveProperty("subTitle");
            expect(res.body.sections[0]).not.toHaveProperty("description");
        }));
    });
    // Test section update
    describe("Update Section", () => {
        it("should update section with new fields", () => __awaiter(void 0, void 0, void 0, function* () {
            if (!createdId) {
                throw new Error("No section ID available for testing");
            }
            const res = yield (0, supertest_1.default)(app_controller_1.default)
                .patch(`/api/v1/section/update?sectionId=${createdId}`)
                .set("Cookie", cookies)
                .attach("image", testImagePath)
                .field("title", "updated section")
                .field("subTitle", "updated subtitle")
                .field("description", ["updated desc1", "updated desc2"])
                .field("features", ["updated feature1", "updated feature2"]);
            expect(res.status).toBe(200);
            expect(res.body.section.title).toBe("updated section");
            expect(res.body.section.subTitle).toBe("updated subtitle");
            expect(res.body.section.description).toEqual([
                "updated desc1",
                "updated desc2",
            ]);
            expect(res.body.section.features).toEqual([
                "updated feature1",
                "updated feature2",
            ]);
            expect(res.body.section.image).toHaveProperty("imageUrl");
        }));
        it("should update section with partial fields", () => __awaiter(void 0, void 0, void 0, function* () {
            if (!createdId) {
                throw new Error("No section ID available for testing");
            }
            const res = yield (0, supertest_1.default)(app_controller_1.default)
                .patch(`/api/v1/section/update?sectionId=${createdId}`)
                .set("Cookie", cookies)
                .send({
                title: "partially updated section",
            });
            expect(res.status).toBe(200);
            expect(res.body.section.title).toBe("partially updated section");
        }));
    });
    // Test section deletion
    describe("Delete Section", () => {
        it("should delete section", () => __awaiter(void 0, void 0, void 0, function* () {
            if (!createdId) {
                throw new Error("No section ID available for testing");
            }
            const res = yield (0, supertest_1.default)(app_controller_1.default)
                .delete(`/api/v1/section/${createdId}`)
                .set("Cookie", cookies);
            expect(res.status).toBe(200);
            expect(res.body.message).toBe("section deleted successfully");
            createdId = null; // Clear the ID after deletion
        }));
        it("should fail to delete non-existent section", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_controller_1.default)
                .delete("/api/v1/section/6802624a669ef3d4c51ddbef")
                .set("Cookie", cookies);
            expect(res.status).toBe(404);
        }));
    });
});
