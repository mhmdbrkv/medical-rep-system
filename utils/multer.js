import multer from "multer";
import { ApiError } from "./apiError.js";

// Image-specific configuration
const imageUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith("image/") &&
      file.originalname.match(/\.(jpg|jpeg|png)$/i)
    ) {
      cb(null, true);
    } else {
      cb(new ApiError("Only image files are allowed!", 422), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB for images
  },
}).single("profileImage");

const filesUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
}).fields([
  { name: "resume", maxCount: 1 },
  { name: "certificates", maxCount: 10 },
]);

export { imageUpload, filesUpload };
