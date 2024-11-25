// cloudinaryConfig.js
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const multer = require('multer');
const path = require('path');



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file hình ảnh!'), false);
  }
};
const limits = {
  fileSize: 5 * 1024 * 1024,
};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits,
});


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Reusable upload function
const uploadImage = async (filePath, folder = 'default_folder') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
    });
    return { url: result.secure_url, public_id: result.public_id };
  } catch (error) {
    throw new Error('Failed to upload image to Cloudinary');
  }
};

module.exports = { cloudinary, uploadImage , upload  };
