import express from "express";
import multer from "multer";
import { addPopularCity, getAllPopularCities,deletePopularCity ,getSinglePopularCity,updatePopularCity} from "../../controllers/admin/populerCitysController";
import { upload } from "../../middleware/upload";
const router = express.Router();


// Routes
router.post("/create-add",upload.single("banner"),  addPopularCity);
router.get("/get-all-popular-cities", getAllPopularCities);
router.get("/delete-popular-city/:id", deletePopularCity);
router.get("/get-popular-city-by-id/:id", getSinglePopularCity);
router.post("/update-popular-city/:id", upload.single("banner"), updatePopularCity);


export default router;
