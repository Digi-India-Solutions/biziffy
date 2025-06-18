"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const faqController_1 = require("../../controllers/admin/faqController");
const router = express_1.default.Router();
router.post("/create-faq", faqController_1.createFaq);
router.get("/get-all-faqs", faqController_1.getAllFaqs);
router.post("/:id/toggle-status", faqController_1.toggleFaqStatus);
router.get("/get-faq-by-id/:id", faqController_1.getFaqById);
router.post("/update-faq/:id", faqController_1.updateFaq);
router.get("/delete-faq/:id", faqController_1.deleteFaq);
exports.default = router;
