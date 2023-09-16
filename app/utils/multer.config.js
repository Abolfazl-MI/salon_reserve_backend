let { createUploadPath } = require("./functions");
let path = require("path");
let multer = require("multer");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = createUploadPath();
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const type = path.extname(file.originalname || "");
    const filename = `${Date.now()}${type}`;
    cb(null, filename);
  },
});
const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
const fileFilter = (req, file, cb) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (allowedTypes.includes(file.mimetype)) {
    if (file.size > maxSize) {
      cb(new Error("Invalid file size up to 5M allowed"));
    } else {
      cb(null, true);
    }
  } else {
    cb(new Error("Invalid file type. only PNG,JPEG,JPG formats are allowed"));
  }
};

function validateUploadedFiles(req, res, next) {
  const uploadedFiles = req.files;
  if (Object.keys(uploadedFiles).length == 0) {
    return next(new Error("No files uploaded"));
  }
  next();
}

let upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = {
  upload,
  validateUploadedFiles,
};
