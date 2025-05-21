import express from "express";
import { createCity, getAllCities ,deleteCity,getCityById,updateCity } from "../../controllers/admin/cityController";
import { upload } from "../../middleware/upload";

const router = express.Router();

router.post("/create-city",upload.single("image"), createCity);
router.get("/get-all-city", getAllCities);
router.get("/delete-city/:id" , deleteCity);
router.get("/get-city-by-id/:id", getCityById);
router.post("/update-city/:id", upload.single("image"), updateCity);
export default router;
