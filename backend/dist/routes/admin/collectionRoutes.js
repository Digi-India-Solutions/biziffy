"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const collectionController_1 = require("../../controllers/admin/collectionController");
const router = express_1.default.Router();
router.post("/create", collectionController_1.createCollection);
router.get("/", collectionController_1.getAllCollections);
exports.default = router;
