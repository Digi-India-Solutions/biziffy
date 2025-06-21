import express from "express";
import Listing from "../../models/BusinessListing";
import Blog from "../../models/Blog";
import Faq from "../../models/FaqModel";
import WebsiteListing from "../../models/WebsiteListingModel";
import Advertisement from "../../models/Advertisement";
import User from "../../models/authModel";
import Category from "../../models/Category";
import Subcategory from "../../models/Subcategory";
import ChildCategory from "../../models/ChildCategoryModel";
import ContactUs from "../../models/Contact";
import Support from "../../models/SupportTicket";
import Enquiry from "../../models/enquiryModel";
import Review from "../../models/reviewModel";

const router = express.Router();

// Generic count handler
const createCountRoute = (path: string, model: any) => {
    router.get(`/${path}/count`, async (req, res) => {
        try {
            const count = await model.find().countDocuments();
            console.log("count:=>", count);
            res.json({ count, path });
        } catch (err: any) {
            res.status(500).json({ message: `Error fetching ${path} count`, error: err.message });
        }
    });
};

// Define all count routes
createCountRoute("listings", Listing);
createCountRoute("website-listings", WebsiteListing);
createCountRoute("advertisements", Advertisement);
createCountRoute("users", User);
createCountRoute("categories", Category);
createCountRoute("subcategories", Subcategory);
createCountRoute("child-categories", ChildCategory);
createCountRoute("contact-us", ContactUs);
createCountRoute("supports", Support);
createCountRoute("enquiries", Enquiry);
createCountRoute("reviews", Review);
createCountRoute("blog", Blog);
createCountRoute("faqs", Faq);


export default router;
