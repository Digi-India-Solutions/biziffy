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

router.post("/create-categories", upload.fields([{ name: "icon", maxCount: 1 }, { name: "banner", maxCount: 1 }]), createCategory);

router.get("/categories", getAllCategories);

router.put("/categories/:id",  upload.fields([{ name: "icon", maxCount: 1 }, { name: "banner", maxCount: 1 }]), updateCategoryById);

router.delete("/categories/:id", deleteCategoryById); // ✅ Delete route

router.get("/categories/:id", getCategoryById); // ✅ Add this

export default router;
