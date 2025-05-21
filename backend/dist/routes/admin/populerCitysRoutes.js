"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const populerCitysController_1 = require("../../controllers/admin/populerCitysController");
const upload_1 = require("../../middleware/upload");
const router = express_1.default.Router();
// Routes
router.post("/create-add", upload_1.upload.single("banner"), populerCitysController_1.addPopularCity);
router.get("/get-all-popular-cities", populerCitysController_1.getAllPopularCities);
router.get("/delete-popular-city/:id", populerCitysController_1.deletePopularCity);
router.get("/get-popular-city-by-id/:id", populerCitysController_1.getSinglePopularCity);
router.post("/update-popular-city/:id", upload_1.upload.single("banner"), populerCitysController_1.updatePopularCity);
exports.default = router;
