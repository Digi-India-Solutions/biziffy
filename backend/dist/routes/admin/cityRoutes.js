"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cityController_1 = require("../../controllers/admin/cityController");
const upload_1 = require("../../middleware/upload");
const router = express_1.default.Router();
router.post("/create-city", upload_1.upload.single("image"), cityController_1.createCity);
router.get("/get-all-city", cityController_1.getAllCities);
router.get("/delete-city/:id", cityController_1.deleteCity);
router.get("/get-city-by-id/:id", cityController_1.getCityById);
router.post("/update-city/:id", upload_1.upload.single("image"), cityController_1.updateCity);
exports.default = router;
