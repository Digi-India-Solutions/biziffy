"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/admin/listingsRoutes.ts
// import { createListingController } from "../../controllers/admin/listingController";
const express_1 = __importDefault(require("express"));
// import {
//   getAllListingsController,
//   updateListingController,
//   deleteListingController
// } from "../../controllers/admin/listingController";
const router = express_1.default.Router();
// ✅ GET all listings with pagination
// router.get("/listings", getAllListingsController);
// ✅ PATCH route to update a specific listing (status, publishStatus, etc.)
// router.patch("/listings/:id", updateListingController);
// listing delete
// routes/admin/listingRoutes.ts
// router.delete("/listings/:id", deleteListingController);
// ✅ POST route to perform bulk actions on multiple listings (optional)
// router.post("/listings/bulk-action", bulkActionListingController);
// router.post("/listings/create", createListingController);
exports.default = router;
