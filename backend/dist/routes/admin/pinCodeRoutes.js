"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pinCodeController_1 = require("../../controllers/admin/pinCodeController");
const router = express_1.default.Router();
router.post("/create-pincode-by-excel", pinCodeController_1.createPincodeByExcel);
router.get("/get-all-pin-codes", pinCodeController_1.getAllPinCodes);
router.post("/create-pincode", pinCodeController_1.createPincode);
router.get("/get-all-pin-codes-by-id/:id", pinCodeController_1.getAllPinCodesById);
router.post("/update-pincode/:id", pinCodeController_1.updatePincode);
router.get("/delete-Pincode/:id", pinCodeController_1.deletePincode);
router.get("/get-areapincode-by-state", pinCodeController_1.getAreapincodeByState);
exports.default = router;
