"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const subcategoryController_1 = require("../../controllers/admin/subcategoryController");
const upload_1 = require("../../middleware/upload");
const router = express_1.default.Router();
const uploadFields = [
    { name: "image", maxCount: 1 },
    { name: "banner", maxCount: 1 },
];
// for (let i = 0; i < 10; i++) {
//   uploadFields.push({ name: `mainSubCategories[${i}][banner]`, maxCount: 1 });
// }
router.post("/create-subcategories", upload_1.upload.fields(uploadFields), subcategoryController_1.createSubcategory);
router.get("/subcategories", subcategoryController_1.getAllSubcategories);
router.delete("/delete-subcategory/:id", subcategoryController_1.deleteSubcategory);
router.get("/get-subcategory-by-id/:id", subcategoryController_1.getSubcategoryById);
router.post("/update-subcategories/:id", upload_1.upload.fields(uploadFields), subcategoryController_1.updateSubcategories);
router.get("/get-Subcategories-by-category/:id", subcategoryController_1.getSubcategoriesByCategory);
exports.default = router;
