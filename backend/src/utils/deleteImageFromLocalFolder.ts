import fs from "fs";
import path from "path";

/**
 * Deletes a file from the local filesystem
 * @param filePath - Relative path from the `src` folder
 */
export const deleteLocalFile = (filePath: string): void => {
    console.log("SSSSSSSDDDDDSS:-", filePath)
    try {
        const fileToDelete = path.join(__dirname, "../../", filePath);
        console.log("SSSSSSSDDDDDSS22222:-", fileToDelete)
        if (fs.existsSync(fileToDelete)) {
            fs.unlinkSync(fileToDelete);
            console.log(`Deleted local file: ${fileToDelete}`);
        } else {
            console.warn(`File not found: ${fileToDelete}`);
        }
    } catch (error) {
        const err = error as Error;
        console.error("Failed to delete local file:", err.message);
    }
};
