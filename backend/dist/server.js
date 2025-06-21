"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const db_1 = require("./config/db");
const advertisementRoutes_1 = __importDefault(require("./routes/admin/advertisementRoutes"));
const childCategoryRoutes_1 = __importDefault(require("./routes/admin/childCategoryRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/admin/categoryRoutes"));
const subcategoryRoutes_1 = __importDefault(require("./routes/admin/subcategoryRoutes"));
const authRoutes_1 = __importDefault(require("./routes/admin/authRoutes"));
const deactivateUserRoute_1 = __importDefault(require("./routes/admin/deactivateUserRoute"));
const departmentRoutes_1 = __importDefault(require("./routes/admin/departmentRoutes"));
const supportTicketRoutes_1 = __importDefault(require("./routes/admin/supportTicketRoutes"));
const enquiryRoutes_1 = __importDefault(require("./routes/admin/enquiryRoutes"));
const linkRoutes_1 = __importDefault(require("./routes/admin/linkRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/admin/reviewRoutes"));
const membershipRoutes_1 = __importDefault(require("./routes/admin/membershipRoutes")); // ✅ important path
const cityRoutes_1 = __importDefault(require("./routes/admin/cityRoutes"));
const dealRoutes_1 = __importDefault(require("./routes/admin/dealRoutes"));
const collectionRoutes_1 = __importDefault(require("./routes/admin/collectionRoutes"));
const stateRoutes_1 = __importDefault(require("./routes/admin/stateRoutes"));
const populerCitysRoutes_1 = __importDefault(require("./routes/admin/populerCitysRoutes"));
const pinCodeRoutes_1 = __importDefault(require("./routes/admin/pinCodeRoutes"));
const contactRoutes_1 = __importDefault(require("./routes/admin/contactRoutes"));
const faqRoutes_1 = __importDefault(require("./routes/admin/faqRoutes"));
const blogRoutes_1 = __importDefault(require("./routes/admin/blogRoutes"));
const adminDashboard_1 = __importDefault(require("./routes/admin/adminDashboard"));
// hm yaha per all listiing ka data import kr rhe hai
const businessListingRoutes_1 = __importDefault(require("./routes/admin/businessListingRoutes"));
const websiteListingRoutes_1 = __importDefault(require("./routes/admin/websiteListingRoutes"));
// for signup 
const authRoutes_2 = __importDefault(require("./routes/admin/authRoutes"));
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("dev"));
const PORT = process.env.PORT || 18001;
(0, db_1.connectDB)();
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:8080",
    // "http://localhost:5173",
    "http://localhost:18001",
    "https://biziffy.com",
    "https://www.biziffy.com",
    "https://admin.biziffy.com",
    "https://www.biziffy.com"
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed CORS"));
        }
    },
    credentials: true,
}));
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use("/api/advertisements", advertisementRoutes_1.default);
app.use("/api/admin/child-categories", childCategoryRoutes_1.default);
app.use("/api", categoryRoutes_1.default);
app.use("/api/admin", subcategoryRoutes_1.default);
app.use("/api/admin", authRoutes_1.default);
app.use("/api/admin", deactivateUserRoute_1.default);
app.use("/api/contactus", contactRoutes_1.default);
app.use("/api/departments", departmentRoutes_1.default);
app.use("/api/admin", supportTicketRoutes_1.default);
app.use("/api/enquiries", enquiryRoutes_1.default);
app.use("/api/links", linkRoutes_1.default);
app.use("/api/reviews", reviewRoutes_1.default);
app.use("/api/admin", membershipRoutes_1.default);
app.use("/api", businessListingRoutes_1.default);
app.use("/api/city", cityRoutes_1.default);
app.use("/api/admin", dealRoutes_1.default);
app.use("/api/admin", collectionRoutes_1.default);
app.use("/api/state", stateRoutes_1.default);
app.use("/api/populerCity", populerCitysRoutes_1.default);
app.use("/api/pincode", pinCodeRoutes_1.default);
app.use('/api/faq', faqRoutes_1.default);
app.use("/api/admin", businessListingRoutes_1.default);
app.use("/api/admin", websiteListingRoutes_1.default);
app.use("/api/blog", blogRoutes_1.default);
app.use("/api/admin/dashboard", adminDashboard_1.default);
// signup
app.use("/api/auth", authRoutes_2.default);
app.use("/api", authRoutes_2.default); // So /api/verify-otp becomes valid
app.use("/api/auth", authRoutes_2.default); // ✅ Important line
app.use("/api/admin/auth", authRoutes_2.default); // 👈 This is crucial
// google login
app.use("/api/user", authRoutes_1.default); // <- this part must match
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
