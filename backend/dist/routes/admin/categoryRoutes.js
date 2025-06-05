"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const categoryController_1 = require("../../controllers/admin/categoryController");
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage });
router.post("/create-categories", upload.fields([{ name: "icon", maxCount: 1 }, { name: "banner", maxCount: 1 }]), categoryController_1.createCategory);
router.get("/categories", categoryController_1.getAllCategories);
router.put("/categories/:id", upload.fields([{ name: "icon", maxCount: 1 }, { name: "banner", maxCount: 1 }]), categoryController_1.updateCategoryById);
router.delete("/categories/:id", categoryController_1.deleteCategoryById); // ✅ Delete route
router.get("/categories/:id", categoryController_1.getCategoryById); // ✅ Add this
exports.default = router;
