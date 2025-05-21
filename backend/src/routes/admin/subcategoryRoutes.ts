import express from "express";
import { createSubcategory, getAllSubcategories,deleteSubcategory, getSubcategoryById,updateSubcategories,getSubcategoriesByCategory} from "../../controllers/admin/subcategoryController";
import { upload } from "../../middleware/upload";

const router = express.Router();

const uploadFields = [
  { name: "image", maxCount: 1 },
  { name: "banner", maxCount: 1 },
];

// for (let i = 0; i < 10; i++) {
//   uploadFields.push({ name: `mainSubCategories[${i}][banner]`, maxCount: 1 });
// }

router.post("/create-subcategories", upload.fields(uploadFields), createSubcategory);

router.get("/subcategories", getAllSubcategories);

router.delete("/delete-subcategory/:id", deleteSubcategory);

router.get("/get-subcategory-by-id/:id",getSubcategoryById)

router.post("/update-subcategories/:id" , upload.fields(uploadFields), updateSubcategories);

router.get("/get-Subcategories-by-category/:id", getSubcategoriesByCategory);

export default router;
