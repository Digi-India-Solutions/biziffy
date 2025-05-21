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
exports.getSubcategoriesByCategory = exports.updateSubcategories = exports.getSubcategoryById = exports.deleteSubcategory = exports.getAllSubcategories = exports.createSubcategory = void 0;
const Subcategory_1 = __importDefault(require("../../models/Subcategory"));
const Category_1 = __importDefault(require("../../models/Category")); // ✅ 1. Import the Category model
const cloudinary_1 = require("../../utils/cloudinary");
const deleteImageFromLocalFolder_1 = require("../../utils/deleteImageFromLocalFolder");
const createSubcategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const { name, status, category, } = req.body;
        // const mainSubCategories = [];
        // if (req.body["mainSubCategories[0][name]"]) {
        //   for (let i = 0; ; i++) {
        //     const subName = req.body[`mainSubCategories[${i}][name]`];
        //     if (!subName) break;
        //     const subBanner = (req.files as { [key: string]: Express.Multer.File[] })?.[`mainSubCategories[${i}][banner]`];
        //     // const imageUrls: String || null = null;
        //     // for (let file of req.files) {
        //     //   const imageUrl = await uploadImage(file.path);
        //     //   imageUrls.push(imageUrl);
        //     //   deleteLocalFile(file.path);
        //     // }
        //     mainSubCategories.push({ name: subName, banner: subBanner?.[0]?.filename || null, });
        //   }
        // }
        const imageFile = (_b = (_a = req.files) === null || _a === void 0 ? void 0 : _a["image"]) === null || _b === void 0 ? void 0 : _b[0];
        const bannerFile = (_d = (_c = req.files) === null || _c === void 0 ? void 0 : _c["banner"]) === null || _d === void 0 ? void 0 : _d[0];
        let imageUrl = null;
        let bannerUrl = null;
        if (imageFile) {
            imageUrl = yield (0, cloudinary_1.uploadImage)(imageFile.path);
            (0, deleteImageFromLocalFolder_1.deleteLocalFile)(imageFile.path);
        }
        if (bannerFile) {
            bannerUrl = yield (0, cloudinary_1.uploadImage)(bannerFile.path);
            (0, deleteImageFromLocalFolder_1.deleteLocalFile)(bannerFile.path);
        }
        const subcategory = new Subcategory_1.default({
            name, status, category, image: imageUrl, banner: bannerUrl,
            // mainSubCategories,
        });
        yield subcategory.save();
        // ✅ 2. Push subcategory into the corresponding category’s subcategories array
        yield Category_1.default.findByIdAndUpdate(category, {
            $push: { subcategories: subcategory._id },
        });
        res.status(201).json(subcategory);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create subcategory" });
    }
});
exports.createSubcategory = createSubcategory;
const getAllSubcategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subcategories = yield Subcategory_1.default.find().populate("category");
        res.status(200).json(subcategories);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch subcategories" });
    }
});
exports.getAllSubcategories = getAllSubcategories;
const deleteSubcategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subcategory = yield Subcategory_1.default.findByIdAndDelete(req.params.id);
        if (!subcategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }
        res.status(200).json({ status: true, message: "Subcategory deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete subcategory" });
    }
});
exports.deleteSubcategory = deleteSubcategory;
const getSubcategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subcategory = yield Subcategory_1.default.findById(req.params.id).populate("category");
        if (!subcategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }
        res.status(200).json(subcategory);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch subcategory" });
    }
});
exports.getSubcategoryById = getSubcategoryById;
const updateSubcategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const { id } = req.params;
        const { name, status, category } = req.body;
        const existingSubcategory = yield Subcategory_1.default.findById(id);
        if (!existingSubcategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }
        const imageFile = (_b = (_a = req.files) === null || _a === void 0 ? void 0 : _a["image"]) === null || _b === void 0 ? void 0 : _b[0];
        const bannerFile = (_d = (_c = req.files) === null || _c === void 0 ? void 0 : _c["banner"]) === null || _d === void 0 ? void 0 : _d[0];
        let imageUrl = null;
        let bannerUrl = null;
        if (imageFile) {
            if (existingSubcategory.image) {
                yield (0, cloudinary_1.deleteImage)(existingSubcategory.image);
            }
            imageUrl = yield (0, cloudinary_1.uploadImage)(imageFile.path);
            (0, deleteImageFromLocalFolder_1.deleteLocalFile)(imageFile.path);
        }
        if (bannerFile) {
            if (existingSubcategory.banner) {
                yield (0, cloudinary_1.deleteImage)(existingSubcategory.banner);
            }
            bannerUrl = yield (0, cloudinary_1.uploadImage)(bannerFile.path);
            (0, deleteImageFromLocalFolder_1.deleteLocalFile)(bannerFile.path);
        }
        // Fetch the existing subcategory
        const prevCategoryId = existingSubcategory.category.toString();
        // Update subcategory fields
        existingSubcategory.name = name;
        existingSubcategory.status = status;
        existingSubcategory.category = category;
        if (imageUrl)
            existingSubcategory.image = imageUrl;
        if (bannerUrl)
            existingSubcategory.banner = bannerUrl;
        const updatedSubcategory = yield existingSubcategory.save();
        // If category was changed, update the category-subcategory references
        if (prevCategoryId !== category) {
            yield Category_1.default.findByIdAndUpdate(prevCategoryId, {
                $pull: { subcategories: id },
            });
            yield Category_1.default.findByIdAndUpdate(category, {
                $addToSet: { subcategories: id },
            });
        }
        res.status(200).json(updatedSubcategory);
    }
    catch (error) {
        console.error("Error updating subcategory:", error);
        res.status(500).json({ message: "Failed to update subcategory" });
    }
});
exports.updateSubcategories = updateSubcategories;
const getSubcategoriesByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = req.params.id;
        // console.log("FFFFFFFFFFFFFFFF:--", category);
        const subcategories = yield Subcategory_1.default.find({ category }).populate("category");
        if (!subcategories) {
            return res.status(404).json({ message: "Subcategories not found" });
        }
        res.status(200).json(subcategories);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch subcategories" });
    }
});
exports.getSubcategoriesByCategory = getSubcategoriesByCategory;
