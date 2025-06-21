import { Request, Response } from "express";
import BusinessListing from "../../models/BusinessListing";
import path from "path";
import fs from "fs";
import { deleteImage, uploadImage } from "../../utils/cloudinary";
import { deleteLocalFile } from "../../utils/deleteImageFromLocalFolder";
import mongoose from "mongoose";

export const createBusinessDetails = async (req: Request, res: Response) => {
  try {
    const { contactPerson, businessDetails, businessTiming, businessCategory, upgradeListing, } = req.body;

    const parsedBusinessDetails = JSON.parse(businessDetails);
    const userId = JSON.parse(contactPerson).userId
    // console.log("userId", userId)
    const existingBusiness = await BusinessListing.findOne({ "businessDetails.businessName": parsedBusinessDetails.businessName, "contactPerson.userId": userId });
    // console.log("userId", existingBusiness)
    if (existingBusiness) {
      return res.status(200).json({ message: "Business already exists", status: false });
    }

    const files = req.files as Express.Multer.File[] | undefined;
    const imageUrls: string[] = [];
    let imageUrl: string | null = null;
    // console.log("ZZZZZZZZZZXXXXXXX1:--", req.files);
    if (files && Array.isArray(files)) {
      for (const file of files) {
        let imageUrl: string | null = null;
        imageUrl = await uploadImage(file.path) as string;
        // console.log("ZZZZZZZZZZXXXXXXX2:--", imageUrl);
        imageUrls.push(imageUrl);
        deleteLocalFile(file.path);
      }
    }

    // console.log("ZZZZZZZZZZXXXXXXX:--", imageUrls);

    const parseBusinessCategory = JSON.parse(businessCategory)

    const listing = new BusinessListing({
      contactPerson: JSON.parse(contactPerson),
      businessDetails: { ...parsedBusinessDetails },
      businessTiming: JSON.parse(businessTiming),
      businessCategory: { ...parseBusinessCategory, businessImages: imageUrls, },
      upgradeListing: JSON.parse(upgradeListing),
    });

    await listing.save();
    // console.log("DDDDDDDDFFFFFFFDDDDDDDD:::---", listing);
    res.status(201).json({ message: "Business listing created successfully", status: true, data: listing, });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error creating business listing:", err);
    res.status(500).json({ message: "Failed to create business listing", status: false, error: err.message, });
  }
};

export const getAllListings = async (req: Request, res: Response) => {
  try {
    const listings = await BusinessListing.find()
      .sort({ createdAt: -1 })
      .populate('businessCategory.category')
      .populate('businessCategory.subCategory')

    // console.log("XXXXXXXX", listings)
    res.status(200).json({ status: true, message: "Listings fetched successfully", data: listings });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).json({ message: "Error fetching listings", error: err.message });
  }
};

export const getAllListingsById = async (req: Request, res: Response) => {
  try {
    const listing = await BusinessListing.findById(req.params.id).populate("businessCategory.category").populate("businessCategory.subCategory");
    if (!listing) return res.status(404).json({ message: "Not found" });

    res.status(200).json({ data: listing, status: true, message: "Listing fetched successfully" });

  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).json({ message: "Error fetching listings", error: err.message });
  }
};

export const updateAllListingsById = async (req: Request, res: Response) => {
  try {
    const listingId = req.params.id;
    const existingListing = await BusinessListing.findById(listingId);

    if (!existingListing) {
      return res.status(404).json({ status: false, message: "Listing not found" });
    }

    const files = req.files as Express.Multer.File[] || [];
    const {
      contactPerson,
      businessDetails,
      businessCategory,
      upgradeListing,
    } = req.body;

    // Utility to parse stringified JSON
    const parseIfJson = (data: any) => {
      try {
        return typeof data === "string" ? JSON.parse(data) : data;
      } catch {
        return data;
      }
    };

    const parsedContact = parseIfJson(contactPerson);
    const parsedDetails = parseIfJson(businessDetails);
    const parsedCategory = parseIfJson(businessCategory);
    const parsedUpgrade = parseIfJson(upgradeListing);

    // Extract files with fieldname `businessImages`
    const uploadedImageFiles = files.filter(file =>
      file.fieldname.startsWith("businessImages")
    );

    let imageUrls: string[] = [];

    if (uploadedImageFiles.length > 0) {
      // Delete old images before uploading new ones
      // if (existingListing.businessCategory?.businessImages?.length > 0) {
      //   for (const oldImage of existingListing.businessCategory.businessImages) {
      //     await deleteImage(oldImage);
      //   }
      // }

      if ((existingListing.businessCategory?.businessImages?.length ?? 0) > 0) {
        for (const oldImage of existingListing.businessCategory!.businessImages!) {
          await deleteImage(oldImage);
        }
      }
      // Upload new images
      for (const file of uploadedImageFiles) {
        const uploadedUrl = await uploadImage(file.path) as string;
        imageUrls.push(uploadedUrl);
        deleteLocalFile(file.path);
      }

      parsedCategory.businessImages = imageUrls;
    } else {
      // No new images uploaded, keep existing images
      parsedCategory.businessImages = existingListing.businessCategory?.businessImages || [];
    }

    // Perform the update
    const updated = await BusinessListing.findByIdAndUpdate(
      listingId,
      {
        contactPerson: parsedContact,
        businessDetails: parsedDetails,
        businessCategory: parsedCategory,
        upgradeListing: parsedUpgrade,
        faq: JSON.parse(req?.body?.faq) || req?.body?.faq
      },
      { new: true }
    );

    return res.status(200).json({ status: true, message: "Listing updated successfully", data: updated, });

  } catch (error: unknown) {
    const err = error as Error;
    return res.status(500).json({ status: false, message: "Error updating listing", error: err.message, });
  }
};

export const deleteBusinessListing = async (req: Request, res: Response) => {
  try {
    const listing = await BusinessListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    // Delete all business images if they exist
    const images: string[] = listing.businessCategory?.businessImages || [];

    images.forEach((img) => {
      const filePath = path.join(__dirname, `/uploads/${img}`);
      // console.log("HHHHHHHH", filePath)
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          deleteImage(img)
        }
      } catch (fileErr) {
        console.error("Error deleting file:", fileErr);
      }
    });

    // Delete the listing from DB
    await BusinessListing.findByIdAndDelete(req.params.id);

    res.status(200).json({ status: true, message: "Listing deleted", data: listing });

  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).json({ message: "Error fetching listings", error: err.message });
  }
};

export const updateBusinessListingStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ status: false, message: "New status is required" });
    }

    const listing = await BusinessListing.findByIdAndUpdate(req.params.id, { "businessDetails.status": status }, { new: true });

    if (!listing) {
      return res.status(404).json({ status: false, message: "Business listing not found" });
    }

    res.status(200).json({ status: true, message: "Business listing status updated successfully", data: listing, });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).json({ message: "Error fetching listings", error: err.message });
  }
};

// export const updateBusinessListingVerified = async (req: Request, res: Response) => {
//   try {
//     const { verified } = req.body;
//     console.log("verified:=>", verified)

//     const listing = await BusinessListing.findByIdAndUpdate(req.params.id, { "verified": verified }, { new: true });

//     if (!listing) {
//       return res.status(404).json({ status: false, message: "Business listing not found" });
//     }

//     res.status(200).json({ status: true, message: "Business listing verified updated successfully", data: listing, });
//   } catch (error: unknown) {
//     const err = error as Error;
//     res.status(500).json({ message: "Error fetching listings", error: err.message });
//   }
// };

export const updateBusinessListingVerified = async (req: Request, res: Response) => {
  try {
    const { verified } = req.body;

    const listing = await BusinessListing.findByIdAndUpdate(req.params.id, { verified }, { new: true });

    if (!listing) {
      return res.status(404).json({ status: false, message: "Business listing not found", });
    }

    res.status(200).json({ status: true, message: "Business listing verification status updated successfully", data: listing, });
  } catch (error: any) {
    res.status(500).json({ status: false, message: "Error updating verification status", error: error.message, });
  }
};

export const changePublishStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ status: false, message: "New status is required" });
    }

    const listing = await BusinessListing.findByIdAndUpdate(
      req.params.id,
      { "businessDetails.publishedDate": status },
      { new: true }
    );

    if (!listing) {
      return res.status(404).json({ status: false, message: "Business listing not found" });
    }

    res.status(200).json({
      status: true,
      message: "Business listing status updated successfully",
      data: listing,
    });
  } catch (err: any) {
    console.error("Error updating business listing status:", err);
    res.status(500).json({
      status: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const listingBulkAction = async (req: Request, res: Response) => {
  try {
    const { ids, action } = req.body;
    // console.log("action:-", ids, action)
    if (!ids || !action) {
      return res.status(400).json({ status: false, message: "Ids and action are required" });
    }

    if (action === "Delete") {
      await BusinessListing.deleteMany({ _id: { $in: ids } });
      return res.status(200).json({ status: true, message: "Listings deleted successfully" });
    }

    if (action === "publish") {
      await BusinessListing.updateMany({ _id: { $in: ids } }, { "businessDetails.publishedDate": action });
      return res.status(200).json({ status: true, message: "Listings published successfully" });
    }

    if (action === "unpublish") {
      await BusinessListing.updateMany({ _id: { $in: ids } }, { "businessDetails.publishedDate": action });
      return res.status(200).json({ status: true, message: "Listings unpublished successfully" });
    }

    if (action === "Rejected" || action === "Approved") {
      await BusinessListing.updateMany({ _id: { $in: ids } }, { "businessDetails.status": action });
      return res.status(200).json({ status: true, message: "Listings unpublished successfully" });
    }



  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

export const getAllListingsByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const listings = await BusinessListing.find({ "contactPerson.userId": userId })
      .populate("businessCategory.category")
      .populate("businessCategory.subCategory")
      .populate("clickCounts.direction.user")
      .populate("clickCounts.share.user")
      .populate("clickCounts.contact.user")
      .populate("clickCounts.whatsapp.user")
      .populate("clickCounts.listings.user");

    if (!listings || listings.length === 0) {
      return res.status(404).json({ status: false, message: "No listings found for this user.", });
    }

    res.status(200).json({ status: true, message: "Listings fetched successfully", data: listings, });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).json({ status: false, message: "Internal server error", error: err.message, });
  }
};


// export const searchBusinessListings = async (req: Request, res: Response) => {
//   const { query = "", pincode = "", state = "", title = "" } = req.query;
//   console.log("Incoming search@@@@:", { query, pincode, state, title });
//   try {
//     const regex = new RegExp(query as string, "i");
//     const pincodeRegex = new RegExp(`\\b${pincode}\\b`, "i");

//     let listings: any[] = [];

//     // Utility: filter only Approved or Published
//     const filterApproved = (data: any[]) =>
//       data.filter((listing: any) => {
//         const status = listing?.businessDetails?.status;
//         return status === "Published" || status === "Approved";
//       });

//     // === Case 1: CityPage ===
//     if (title === "CityPage") {
//       const cityQuery: any = {
//         $or: [
//           { "businessDetails.businessName": regex },
//           { "businessCategory.about": regex },
//           { "businessCategory.keywords": { $in: [regex] } },
//           { "businessCategory.businessService": regex },
//           { "businessCategory.category.name": regex },
//           { "businessCategory.subcategory.name": regex },

//         ],
//       };

//       // Add pincode and/or state to the filter if they exist
//       if (pincode) {
//         cityQuery.$or.push({ "businessDetails.pinCode": pincode });
//         cityQuery.$or.push({ "businessCategory.serviceArea": { $elemMatch: { $regex: pincodeRegex } } });
//       }
//       if (state) {
//         cityQuery.$or.push({ "businessDetails.state": state });
//       }

//       const allByLocation = await BusinessListing.find(cityQuery).populate(
//         "businessCategory.category businessCategory.subCategory"
//       );

//       listings = allByLocation.filter((listing: any) =>
//         listing?.businessCategory?.category?.name?.toLowerCase() === (query as string).toLowerCase()
//       );
//     }

//     // === Case 2: General Search ===
//     else {
//       const andConditions: any[] = [
//         {
//           $or: [
//             { "businessDetails.businessName": regex },
//             { "businessCategory.about": regex },
//             { "businessCategory.keywords": { $in: [regex] } },
//             { "businessCategory.businessService": regex },
//             { "businessCategory.serviceArea": { $elemMatch: { $regex: regex } } },
//           ],
//         },
//       ];

//       const locationConditions: any[] = [];
//       if (pincode) {
//         locationConditions.push({ "businessDetails.pinCode": pincode });
//         locationConditions.push({ "businessCategory.serviceArea": { $elemMatch: { $regex: pincodeRegex } } });
//       }
//       if (state) {
//         locationConditions.push({ "businessDetails.state": state });
//       }

//       if (locationConditions.length > 0) {
//         andConditions.push({ $or: locationConditions });
//       }

//       listings = await BusinessListing.find({ $and: andConditions }).populate(
//         "businessCategory.category businessCategory.subCategory"
//       );
//     }

//     const filteredListings = filterApproved(listings);

//     return res.status(200).json({ status: true, data: filteredListings });
//   } catch (error: any) {
//     console.error("Search error:", error.message);
//     return res.status(500).json({ status: false, message: "Internal server error", error: error.message, });
//   }
// };


// export const searchBusinessListings = async (req: Request, res: Response) => {
//   const { query = "", pincode = "", state = "", title = "" } = req.query;

//   console.log("Incoming search@@@@:", { query, pincode, state, title });

//   try {
//     const regex = new RegExp(query as string, "i");
//     const pincodeRegex = new RegExp(`\\b${pincode}\\b`, "i");

//     let listings: any[] = [];

//     // === Helper: filter only Approved or Published ===
//     const filterApproved = (data: any[]) =>
//       data.filter((listing: any) => {
//         const status = listing?.businessDetails?.status;
//         return status === "Published" || status === "Approved";
//       });

//     // === Case 1: CityPage ===
//     if (title === "CityPage") {
//       const cityQuery: any = {
//         $or: [
//           { "businessDetails.businessName": regex },
//           { "businessCategory.about": regex },
//           { "businessCategory.keywords": { $in: [regex] } },
//           { "businessCategory.businessService": regex },
//         ],
//       };

//       // Location filters
//       if (pincode) {
//         cityQuery.$or.push(
//           { "businessDetails.pinCode": pincode },
//           { "businessCategory.serviceArea": { $elemMatch: { $regex: pincodeRegex } } }
//         );
//       }

//       if (state) {
//         cityQuery.$or.push({ "businessDetails.state": state });
//       }

//       listings = await BusinessListing.find(cityQuery).populate(
//         "businessCategory.category businessCategory.subCategory"
//       );

//       // Try exact category match if possible
//       listings = listings.filter(
//         (listing: any) =>
//           listing?.businessCategory?.category?.name?.toLowerCase() === (query as string).toLowerCase()
//       );
//     }

//     // === Case 2: General Search ===
//     else {
//       const andConditions: any[] = [
//         {
//           $or: [
//             { "businessDetails.businessName": regex },
//             { "businessCategory.about": regex },
//             { "businessCategory.keywords": { $in: [regex] } },
//             { "businessCategory.businessService": regex },
//             { "businessCategory.serviceArea": { $elemMatch: { $regex: regex } } },
//           ],
//         },
//       ];

//       const locationConditions: any[] = [];
//       if (pincode) {
//         locationConditions.push(
//           { "businessDetails.pinCode": pincode },
//           { "businessCategory.serviceArea": { $elemMatch: { $regex: pincodeRegex } } }
//         );
//       }
//       if (state) {
//         locationConditions.push({ "businessDetails.state": state });
//       }

//       if (locationConditions.length > 0) {
//         andConditions.push({ $or: locationConditions });
//       }

//       listings = await BusinessListing.find({ $and: andConditions }).populate(
//         "businessCategory.category businessCategory.subCategory"
//       );
//     }

//     const filteredListings = filterApproved(listings);

//     return res.status(200).json({ status: true, data: filteredListings });
//   } catch (error: any) {
//     console.error("Search error:", error.message);
//     return res.status(500).json({
//       status: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };


export const searchBusinessListings = async (req: Request, res: Response) => {
  const { query = "", pincode = "", state = "", title = "" } = req.query;

  console.log("🔍 Incoming search:=>>", { query, pincode, state, title });

  try {
    const keywordRegex = new RegExp(query as string, "i");
    const pincodeRegex = new RegExp(`\\b${pincode}\\b`, "i");

    // Step 1: Construct base query
    const baseQuery: any = {
      $or: [
        { "businessDetails.businessName": keywordRegex },
        { "businessCategory.about": keywordRegex },
        { "businessCategory.keywords": { $in: [keywordRegex] } },
        { "businessCategory.businessService": keywordRegex },
        { "businessCategory.categoryName": keywordRegex },
        { "businessCategory.subCategoryName": { $in: [keywordRegex] } },
        { "businessCategory.serviceArea": { $elemMatch: { $regex: keywordRegex } } }
      ]
    };

    console.log("listingsDATA:-", baseQuery)
    // Step 2: Add pincode/state filters if present
    const locationFilters: any[] = [];
    if (pincode) {
      locationFilters.push(
        { "businessDetails.pinCode": pincode },
        { "businessCategory.serviceArea": { $elemMatch: { $regex: pincodeRegex } } }
      );
    }
    if (state) {
      locationFilters.push({ "businessDetails.state": state });
    }
    if (locationFilters.length) {
      baseQuery.$and = [{ $or: locationFilters }];
    }
    // console.log("baseQuery:==",baseQuery)
    let listings = await BusinessListing.find(baseQuery)
      .populate("businessCategory.category businessCategory.subCategory")
    // .lean(); // Lean for performance

    // Step 3: Additional filtering for CityPage (match category name exactly)
    if (title === "CityPage" && query) {
      listings = listings.filter((listing: any) =>
        listing.businessCategory?.category?.name?.toLowerCase() === (query as string).toLowerCase()
      );
    }

    // Step 4: Final filtering for status
    const filteredListings = listings.filter((listing: any) => {
      const status = listing.businessDetails?.status;
      return status === "Published" || status === "Approved";
    });

    // console.log('XXXXXXXXXXXXX:---',filteredListings)

    return res.status(200).json({
      status: true,
      data: filteredListings,
    });

  } catch (error: any) {
    console.error("❌ Search Error:", error.message);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};




export const increaseClickCount = async (req: Request, res: Response) => {
  try {
    const allowedClickTypes = ["direction", "share", "contact", "website", "whatsapp", "listings"];
    const { type, user } = req.body;
    const businessId = req.params.id;

    console.log("🚀 Click type:", req.body, businessId, type);

    if (!type || !allowedClickTypes.includes(type)) {
      return res.status(400).json({ status: false, message: "Invalid or missing click type." });
    }

    if (!user) {
      return res.status(400).json({ status: false, message: "Missing userId in body." });
    }

    const business = await BusinessListing.findById(businessId);
    console.log("🚀business:", business);
    if (!business) {
      return res.status(404).json({ status: false, message: "Business not found." });
    }

    // Ensure clickCounts is initialized
    if (!business.clickCounts) {
      business.clickCounts = {} as any;
    }

    // Ensure the specific click type is initialized
    if (!(business as any).clickCounts[type]) {
      (business as any).clickCounts[type] = {
        count: 0,
        user: [],
      };
    }

    // If user is not an array (corrupted), convert it
    if (!Array.isArray((business as any).clickCounts[type].user)) {
      (business as any).clickCounts[type].user = (business as any).clickCounts[type].user
        ? [(business as any).clickCounts[type].user]
        : [];
    }

    // Only add user if not already present
    if (!(business as any).clickCounts[type].user.some((u: any) => u.toString() === user)) {
      (business as any).clickCounts[type].user.push(user);
    }

    // Increment the click count
    (business as any).clickCounts[type].count += 1;

    // await business.save();
    const update = await BusinessListing.findOneAndUpdate({ businessId, business });

    return res.status(200).json({
      status: true,
      message: `${type} click count incremented.`,
      updatedCounts: (update as any).clickCounts[type],
    });
  } catch (error: any) {
    console.error("Click count error:", error);
    return res.status(500).json({ status: false, message: error.message || "Server error." });
  }
};


export const postReviewAllListingsById = async (req: Request, res: Response) => {
  try {
    console.log("BODY:->", req.body);

    const listing = await BusinessListing.findById(req.params.id);
    if (!listing) {
      return res.status(204).json({ status: false, message: "Business listing not found" });
    }

    // Extract and format review fields properly
    const review = {
      author: req.body['reviews[author]'],
      comment: req.body['reviews[comment]'],
      rating: parseInt(req.body['reviews[rating]']),
      user: req.body['reviews[user]'],
    };

    // Basic validation
    if (!review.author || !review.comment || isNaN(review.rating) || !review.user) {
      return res.status(200).json({ status: false, message: "Missing or invalid review fields" });
    }

    // Check if the user already added a review
    // const alreadyReviewed = listing.reviews.some(r => r.user.toString() === review?.user);
    const alreadyReviewed = listing.reviews.some(
      r => r.user && r.user.toString() === review?.user
    );
    if (alreadyReviewed) {
      return res.status(200).json({
        status: false,
        message: "You have already submitted a review for this business listing.",
      });
    }

    // Add the review
    listing.reviews.push(review);
    // await listing.save();

    const updatedListing = await BusinessListing.findByIdAndUpdate(req.params.id, listing, { new: true });
    if (!updatedListing) {
      return res.status(204).json({ status: false, message: "Business listing not found" });
    }

    return res.status(200).json({
      status: true,
      message: "Review added successfully",
      data: listing.reviews[listing.reviews.length - 1],
    });

  } catch (error: any) {
    console.error("Error adding review:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to add review",
      error: error.message,
    });
  }
};
