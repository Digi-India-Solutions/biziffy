// routes/admin/cityRoutes1.ts

import { Router } from "express";
import { createState, getAllState,deleteState ,getAllStateById ,updateState} from "../../controllers/admin/stateController";
import { upload } from "../../middleware/upload";

const router = Router();

router.post("/create/state", upload.single("image"), createState);

router.get("/get-all-states", getAllState);

router.get("/delete-state/:id", deleteState);

router.get("/get-all-state-by-id/:id", getAllStateById);

router.post("/update-state/:id", upload.single("image"), updateState);
export default router;
