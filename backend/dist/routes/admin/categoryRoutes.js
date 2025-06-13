"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categoryController_1 = require("../../controllers/admin/categoryController");
const router = express_1.default.Router();
const upload_1 = require("../../middleware/upload");
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });
// const upload = multer({ storage });
router.post("/create-categories", upload_1.upload.fields([{ name: "icon", maxCount: 1 }, { name: "banner", maxCount: 1 }]), categoryController_1.createCategory);
router.get("/categories", categoryController_1.getAllCategories);
router.put("/categories/:id", upload_1.upload.fields([{ name: "icon", maxCount: 1 }, { name: "banner", maxCount: 1 }]), categoryController_1.updateCategoryById);
router.delete("/categories/:id", categoryController_1.deleteCategoryById); // ✅ Delete route
router.get("/categories/:id", categoryController_1.getCategoryById); // ✅ Add this
exports.default = router;
