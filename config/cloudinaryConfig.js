// cloudinaryConfig.js
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

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

module.exports = { cloudinary, uploadImage };
