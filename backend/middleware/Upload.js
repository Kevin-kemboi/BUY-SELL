// middleware/upload.js
const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');
const path = require('path');

const mongoURI = 'mongodb://localhost:27017/Zin';

const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = Date.now() + path.extname(file.originalname);
      const fileInfo = {
        filename: filename,
        bucketName: 'uploads', // The collection name
      };
      resolve(fileInfo);
    });
  },
});

const upload = multer({ storage });

module.exports = upload;
