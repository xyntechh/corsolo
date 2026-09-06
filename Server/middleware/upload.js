const multer = require("multer");
const path = require("path");


const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary.js");

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,

  params: async (req, file) => {
    const isAudio = file.mimetype.startsWith("audio");

    return {
      folder: "chat-media",
      resource_type: isAudio ? "video" : "image",
      public_id: `${Date.now()}-${file.originalname}`,
    };
  },
});

const cloudinaryUpload = multer({
  storage: cloudinaryStorage,

  limits: {
    fileSize: 15 * 1024 * 1024, // 15 MB
  },
});


const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    const filename =
      `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

    cb(null, filename);
  },
});

const localUpload = multer({
  storage: localStorage,

  limits: {
    fileSize: 15 * 1024 * 1024, // 15 MB
  },
});


module.exports = {
  cloudinaryUpload,
  localUpload,
};