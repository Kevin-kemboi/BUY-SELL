const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./uploads", // specify the uploads folder
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Check file type

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 20000000 }, // limit file size to 20MB
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single("file"); // single file upload with the field name 'file'


module.exports = upload