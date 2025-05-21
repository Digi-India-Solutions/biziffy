"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dealController_1 = require("../../controllers/admin/dealController");
const router = express_1.default.Router();
router.post("/create", dealController_1.createDeal);
router.get("/", dealController_1.getAllDeals);
exports.default = router;
