import express from "express";
import { createPincodeByExcel, getAllPinCodes, createPincode, getAllPinCodesById, updatePincode, deletePincode, getAreapincodeByState } from "../../controllers/admin/pinCodeController";

const router = express.Router();

router.post("/create-pincode-by-excel", createPincodeByExcel)
router.get("/get-all-pin-codes", getAllPinCodes)
router.post("/create-pincode", createPincode)
router.get("/get-all-pin-codes-by-id/:id", getAllPinCodesById)
router.post("/update-pincode/:id", updatePincode)
router.get("/delete-Pincode/:id", deletePincode)
router.get("/get-areapincode-by-state", getAreapincodeByState)
export default router;
