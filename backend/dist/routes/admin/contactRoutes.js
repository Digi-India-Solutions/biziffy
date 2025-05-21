"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contactController_1 = require("../../controllers/admin/contactController");
const router = express_1.default.Router();
router.get("/get-all-contact", contactController_1.getAllContacts); // For frontend fetch
router.post("/create-contact", contactController_1.createContact);
router.post("/update-status/:id", contactController_1.updateStatus); // For Postman or form submission
exports.default = router;
