"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const BusinessListing_1 = __importDefault(require("../../models/BusinessListing"));
const Blog_1 = __importDefault(require("../../models/Blog"));
const FaqModel_1 = __importDefault(require("../../models/FaqModel"));
const WebsiteListingModel_1 = __importDefault(require("../../models/WebsiteListingModel"));
const Advertisement_1 = __importDefault(require("../../models/Advertisement"));
const authModel_1 = __importDefault(require("../../models/authModel"));
const Category_1 = __importDefault(require("../../models/Category"));
const Subcategory_1 = __importDefault(require("../../models/Subcategory"));
const ChildCategoryModel_1 = __importDefault(require("../../models/ChildCategoryModel"));
const Contact_1 = __importDefault(require("../../models/Contact"));
const SupportTicket_1 = __importDefault(require("../../models/SupportTicket"));
const enquiryModel_1 = __importDefault(require("../../models/enquiryModel"));
const reviewModel_1 = __importDefault(require("../../models/reviewModel"));
const router = express_1.default.Router();
// Generic count handler
const createCountRoute = (path, model) => {
    router.get(`/${path}/count`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const count = yield model.find().countDocuments();
            console.log("count:=>", count);
            res.json({ count, path });
        }
        catch (err) {
            res.status(500).json({ message: `Error fetching ${path} count`, error: err.message });
        }
    }));
};
// Define all count routes
createCountRoute("listings", BusinessListing_1.default);
createCountRoute("website-listings", WebsiteListingModel_1.default);
createCountRoute("advertisements", Advertisement_1.default);
createCountRoute("users", authModel_1.default);
createCountRoute("categories", Category_1.default);
createCountRoute("subcategories", Subcategory_1.default);
createCountRoute("child-categories", ChildCategoryModel_1.default);
createCountRoute("contact-us", Contact_1.default);
createCountRoute("supports", SupportTicket_1.default);
createCountRoute("enquiries", enquiryModel_1.default);
createCountRoute("reviews", reviewModel_1.default);
createCountRoute("blog", Blog_1.default);
createCountRoute("faqs", FaqModel_1.default);
exports.default = router;
