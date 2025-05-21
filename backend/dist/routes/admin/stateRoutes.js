"use strict";
// routes/admin/cityRoutes1.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stateController_1 = require("../../controllers/admin/stateController");
const upload_1 = require("../../middleware/upload");
const router = (0, express_1.Router)();
router.post("/create/state", upload_1.upload.single("image"), stateController_1.createState);
router.get("/get-all-states", stateController_1.getAllState);
router.get("/delete-state/:id", stateController_1.deleteState);
router.get("/get-all-state-by-id/:id", stateController_1.getAllStateById);
router.post("/update-state/:id", upload_1.upload.single("image"), stateController_1.updateState);
exports.default = router;
