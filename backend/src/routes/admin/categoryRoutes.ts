import express from "express";
import multer from "multer";
import { createCategory, getAllCategories, updateCategoryById, deleteCategoryById, getCategoryById, } from "../../controllers/admin/categoryController";
const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/create-categories", upload.single("icon"), createCategory);

router.get("/categories", getAllCategories);

router.put("/categories/:id", upload.single("icon"), updateCategoryById);

router.delete("/categories/:id", deleteCategoryById); // ✅ Delete route

router.get("/categories/:id", getCategoryById); // ✅ Add this

export default router;
