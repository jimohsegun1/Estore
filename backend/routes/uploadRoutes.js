import path from "path";
import express from "express";
import multer from "multer";
import { authenticate } from "../middlewares/authMiddleware.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  if (filetypes.test(extname) && mimetypes.test(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and WebP images are allowed"), false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

router.post("/", authenticate, upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image file provided" });
  }

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "estore/products" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    res.status(200).json({
      message: "Image uploaded successfully",
      image: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    res.status(500).json({ message: "Upload to Cloudinary failed", error: error.message });
  }
});

export default router;