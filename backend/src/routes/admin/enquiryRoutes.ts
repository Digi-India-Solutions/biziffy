import express from "express";
import { getAllEnquiries, createEnquiry } from "../../controllers/admin/enquiryController";

const router = express.Router();

router.get("/", getAllEnquiries);
router.post("/create-enquiryform", createEnquiry);

export default router;
