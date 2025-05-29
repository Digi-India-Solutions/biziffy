import { Request, Response } from "express";
import BusinessListing from "../../models/BusinessListing";
import path from "path";
import fs from "fs";
import { deleteImage, uploadImage } from "../../utils/cloudinary";
import { deleteLocalFile } from "../../utils/deleteImageFromLocalFolder";
import mongoose from "mongoose";

// Step 1: Create Contact
// export const createContact = async (req: Request, res: Response) => {
//   try {
//     const contact = new Contact(req.body);
//     await contact.save();
//     res.status(201).json({ message: "Contact saved", data: contact });
//   } catch (error) {
//     console.error("Error occurred:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// // Step 2: Create Business Category
// export const createBusinessCategory = async (req: Request, res: Response) => {
//   try {
//     const { category, businessImages, about, keywords, serviceArea } = req.body;

//     if (!category || !businessImages || !about) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const newCategory = new BusinessCategory({
//       category,
//       businessImages,
//       about,
//       keywords,
//       serviceArea,
//     });

//     await newCategory.save();
//     res.status(201).json({ message: "Business category created successfully!" });
//   } catch (error) {
//     console.error("Error creating business category:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// // Step 3: Create Business Timing
// export const createBusinessTiming = async (req: Request, res: Response) => {
//   try {
//     const { timings } = req.body;

//     // Validate if timings array is provided and is not empty
//     if (!timings || timings.length === 0) {
//       return res.status(400).json({ message: "Timings data is required." });
//     }

//     // Validate that every day has openTime and closeTime if 'isOpen' is true
//     const invalidTimings = timings.some(item =>
//       item.isOpen && (!item.openTime || !item.closeTime)
//     );

//     if (invalidTimings) {
//       return res.status(400).json({ message: "Please fill in all timings for selected days." });
//     }

//     // Save business timings
//     const savedTimings = await BusinessTiming.create(timings);

//     res.status(201).json({ message: "Timings saved successfully", data: savedTimings });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// // Step 4: Create Upgrade Listing
// export const createUpgradeListing = async (req: Request, res: Response) => {
//   const { direction, website, facebook, instagram, linkedin, twitter } = req.body;

//   // Validate the required fields
//   if (!direction || !website) {
//     return res.status(400).json({ message: "Direction and Website are required" });
//   }

//   try {
//     const upgrade = new UpgradeListing({
//       direction,
//       website,
//       facebook,
//       instagram,
//       linkedin,
//       twitter,
//     });

//     await upgrade.save();

//     res.status(201).json({
//       message: "Upgrade listing saved successfully",
//       data: upgrade,
//     });
//   } catch (err) {
//     console.error("Error saving upgrade listing:", err);
//     res.status(500).json({
//       message: "Failed to save upgrade listing",
//       error: "Internal Server Error",
//     });
//   }
// };

// // Step 5: Create Business Listing
// export const createBusinessListing = async (req: Request, res: Response) => {
//   try {
//     const listing = new BusinessListing(req.body);
//     await listing.save();
//     res.status(201).json({ message: "Full business listing saved", data: listing });
//   } catch (err) {
//     console.error("BusinessListing Save Error:", err);
//     res.status(500).json({ message: "Failed to save full business listing", error: err });
//   }
// };

// // Step 6: Get All Full Business Listings (merged from 5 forms)
// export const getAllFullListings = async (req: Request, res: Response) => {
//   try {
//     const businessDetails = await BusinessDetails.find();
//     const contacts = await Contact.find();
//     const categories = await BusinessCategory.find();
//     const timings = await BusinessTiming.find();
//     const upgrades = await UpgradeListing.find();

//     const listings = businessDetails.map((detail, index) => ({
//       businessDetails: detail,
//       contactPerson: contacts[index],
//       categories: categories[index],
//       timings: timings[index],
//       upgrade: upgrades[index],
//     }));

//     res.status(200).json(listings);
//   } catch (error) {
//     console.error("Error fetching listings:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Step 7: Update Business Status
// export const updateBusinessStatus = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const { status } = req.body;

//   try {
//     const listing = await BusinessListing.findById(id);
//     if (!listing) {
//       return res.status(404).json({ message: "Listing not found" });
//     }

//     // Directly update fields in BusinessListing
//     listing.businessStatus = status;
//     listing.trustStatus =
//       status === "Approved" || status === "Pending" ? "Approved" : "Not Approved";

//     await listing.save();

//     res.status(200).json({ message: "Business status updated successfully", listing });
//   } catch (error) {
//     console.error("Error updating business status:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Step 8: Delete Business Listing by ID
// // export const deleteBusinessListing = async (req: Request, res: Response) => {
// //   const { id } = req.params;

// //   try {
// //     const deletedListing = await BusinessListing.findByIdAndDelete(id);

// //     if (!deletedListing) {
// //       return res.status(404).json({ message: "Business listing not found" });
// //     }

// //     res.status(200).json({ message: "Business listing deleted successfully", data: deletedListing });
// //   } catch (err) {
// //     console.error("Error deleting business listing:", err);
// //     res.status(500).json({ message: "Failed to delete business listing", error: err });
// //   }
// // };

// // Step 9: Update Publish Status
// export const updatePublishStatus = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const { status } = req.body;

//   try {
//     const listing = await BusinessListing.findById(id);
//     if (!listing) {
//       return res.status(404).json({ message: "Listing not found" });
//     }

//     listing.publishedDate = status;

//     await listing.save();

//     res.status(200).json({ message: "Publish status updated successfully", listing });
//   } catch (error) {
//     console.error("Error updating publish status:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Step 10: Get Business Listing Details by ID
// export const getBusinessListingDetails = async (req: Request, res: Response) => {
//   const { id } = req.params;

//   try {
//     const listing = await BusinessListing.findById(id);
//     if (!listing) {
//       return res.status(404).json({ message: "Business listing not found" });
//     }

//     const businessDetails = await BusinessDetails.findOne({ listingId: id });
//     const contact = await Contact.findOne({ listingId: id });
//     const category = await BusinessCategory.findOne({ listingId: id });
//     const timing = await BusinessTiming.findOne({ listingId: id });
//     const upgrade = await UpgradeListing.findOne({ listingId: id });

//     return res.status(200).json({
//       message: "Business listing details fetched successfully",
//       data: {
//         listing,
//         businessDetails,
//         contact,
//         category,
//         timing,
//         upgrade,
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching business listing details:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };




//////////////////////////////////////////////////////////////////

//////////////////////////////////AASIB KHAN////////////////////////////////////////////////////////////////////////////

export const createBusinessDetails = async (req: Request, res: Response) => {
  try {
    const { contactPerson, businessDetails, businessTiming, businessCategory, upgradeListing, } = req.body;

    const parsedBusinessDetails = JSON.parse(businessDetails);
    const existingBusiness = await BusinessListing.findOne({ "businessDetails.businessName": parsedBusinessDetails.businessName, });

    if (existingBusiness) {
      return res.status(400).json({ message: "Business already exists", status: false });
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
//   const { query = "", pincode, title = '' } = req.query;

//   // console.log("Incoming search:", { query, pincode, title });

//   if (!pincode || typeof pincode !== "string") {
//     return res.status(400).json({ status: false, error: "'pincode' is required." });
//   }

//   try {
//     const regex = new RegExp(query as string, "i");
//     let listings: any[] = [];

//     if (title === "CityPage") {
//       // console.log("CityPage")
//       // Fetch all listings with the given pincode
//       const allByPincode = await BusinessListing.find({
//         "businessDetails.pinCode": pincode
//       }).populate("businessCategory.category businessCategory.subCategory");

//       listings = allByPincode.filter((listing: any) => {
//         return (
//           listing?.businessCategory?.category?.name?.toLowerCase() === (query as string).toLowerCase()
//         );
//       });
//     } else {
//       // console.log("CityPage console.log(CityPage)")
//       // General search by text query and pincode
//       listings = await BusinessListing.find({
//         $and: [
//           {
//             $or: [
//               { "businessDetails.businessName": regex },
//               { "businessCategory.about": regex },
//               { "businessCategory.keywords": { $in: [regex] } },
//               { "businessCategory.businessService": regex },
//               { "businessCategory.serviceArea": { $in: [regex] } }
//             ]
//           },
//           { "businessDetails.pinCode": pincode }
//         ]
//       }).populate("businessCategory.category businessCategory.subCategory");
//     }

//     // Only include Published or Approved listings
//     const filteredListings = listings.filter((listing: any) => {
//       const status = listing?.businessDetails?.status;
//       return status === "Published" || status === "Approved";
//     });

//     // console.log("filteredListings", filteredListings)
//     return res.status(200).json({ status: true, data: filteredListings });
//   } catch (error: any) {
//     console.error("Search error:", error.message);
//     return res.status(500).json({ status: false, message: "Internal server error", error: error.message });
//   }
// };


export const searchBusinessListings = async (req: Request, res: Response) => {
  const { query = "", pincode, title = '' } = req.query;

  if (!pincode || typeof pincode !== "string") {
    return res.status(400).json({ status: false, error: "'pincode' is required." });
  }

  try {
    const regex = new RegExp(query as string, "i");
    let listings: any[] = [];

    if (title === "CityPage") {
      // Fetch all listings with the given pincode (in businessDetails or serviceArea)
      const allByPincode = await BusinessListing.find({
        $or: [
          { "businessDetails.pinCode": pincode },
          { "businessCategory.serviceArea": { $elemMatch: { $regex: pincode, $options: 'i' } } }
        ]
      }).populate("businessCategory.category businessCategory.subCategory");

      listings = allByPincode.filter((listing: any) => {
        return (
          listing?.businessCategory?.category?.name?.toLowerCase() === (query as string).toLowerCase()
        );
      });
    } else {
      // General search by text query and pincode (including serviceArea check)
      listings = await BusinessListing.find({
        $and: [
          {
            $or: [
              { "businessDetails.businessName": regex },
              { "businessCategory.about": regex },
              { "businessCategory.keywords": { $in: [regex] } },
              { "businessCategory.businessService": regex },
              { "businessCategory.serviceArea": { $in: [regex] } }
            ]
          },
          {
            $or: [
              { "businessDetails.pinCode": pincode },
              { "businessCategory.serviceArea": { $elemMatch: { $regex: pincode, $options: 'i' } } }
            ]
          }
        ]
      }).populate("businessCategory.category businessCategory.subCategory");
    }

    // Only include listings with status Published or Approved
    const filteredListings = listings.filter((listing: any) => {
      const status = listing?.businessDetails?.status;
      return status === "Published" || status === "Approved";
    });

    return res.status(200).json({ status: true, data: filteredListings });
  } catch (error: any) {
    console.error("Search error:", error.message);
    return res.status(500).json({ status: false, message: "Internal server error", error: error.message });
  }
};


export const increaseClickCount = async (req: Request, res: Response) => {
  try {
    const allowedClickTypes = ["direction", "share", "contact", "website", "whatsapp", "listings"];
    const { type, user } = req.body;
    const businessId = req.params.id;

    if (!type || !allowedClickTypes.includes(type)) {
      return res.status(400).json({ status: false, message: "Invalid or missing click type." });
    }

    if (!user) {
      return res.status(400).json({ status: false, message: "Missing userId in body." });
    }

    const business = await BusinessListing.findById(businessId);
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

    await business.save();

    return res.status(200).json({
      status: true,
      message: `${type} click count incremented.`,
      updatedCounts: (business as any).clickCounts[type],
    });
  } catch (error: any) {
    console.error("Click count error:", error);
    return res.status(500).json({ status: false, message: error.message || "Server error." });
  }
};

