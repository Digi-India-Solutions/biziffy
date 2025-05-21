import { v2 as cloudinary } from 'cloudinary';

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME as string,
  api_key: process.env.API_KEY as string,
  api_secret: process.env.API_SECKRET as string,
});

// Upload image to Cloudinary
export const uploadImage = async (file: string): Promise<string | null> => {
  try {
    const result = await cloudinary.uploader.upload(file);
    console.log(result)
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return null;
  }
};

// Delete image(s) from Cloudinary
export const deleteImage = async (imageUrls: string | string[]): Promise<void> => {
  try {
    const urls = Array.isArray(imageUrls) ? imageUrls : [imageUrls];

    for (const url of urls) {
      if (typeof url === "string") {
        const filename = url.split("/").pop();
        const publicId = filename?.split(".")[0];

        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
          console.log(`Image deleted successfully: ${publicId}`);
        } else {
          console.warn(`Could not extract publicId from URL: ${url}`);
        }
      }
    }
  } catch (error) {
    console.error("Failed to delete image(s) from Cloudinary:", error);
  }
};
