import express from "express";
import { createContact, getAllContacts,updateStatus } from "../../controllers/admin/contactController";

const router = express.Router();

router.get("/get-all-contact", getAllContacts);       // For frontend fetch
router.post("/create-contact", createContact);  
router.post("/update-status/:id",updateStatus)     // For Postman or form submission

export default router;
