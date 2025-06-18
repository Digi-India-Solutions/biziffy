import express from "express";
import { createFaq, getAllFaqs, getFaqById, updateFaq, deleteFaq, toggleFaqStatus, } from "../../controllers/admin/faqController";

const router = express.Router();

router.post("/create-faq", createFaq);

router.get("/get-all-faqs", getAllFaqs);

router.post("/:id/toggle-status", toggleFaqStatus);

router.get("/get-faq-by-id/:id", getFaqById);

router.post("/update-faq/:id", updateFaq);

router.get("/delete-faq/:id", deleteFaq);

export default router;
