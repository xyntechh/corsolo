const multer = require("multer");
const path = require("path");


const uploadPath = path.join(__dirname, "../uploads");



const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    const filename =
      `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

    cb(null, filename);
  },
});

const localUpload = multer({
  storage: localStorage,

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      // Images
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/heic",
      "image/heif",

      // Audio
      "audio/mpeg",   // MP3
      "audio/mp4",    // M4A / MP4 audio
      "audio/x-m4a",  // M4A (some devices/browsers)
      "audio/wav",    // WAV
      "audio/x-wav",
      "audio/ogg",    // OGG
      "audio/webm",   // WebM audio
      "audio/aac",    // AAC
    ];


    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },

  limits: {
    fileSize: 15 * 1024 * 1024,
  },
});



module.exports = {
  localUpload,
};