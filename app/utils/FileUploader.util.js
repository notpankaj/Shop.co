const multer = require("multer");
const path = require("path");
const uploadDir = path.join(__dirname, "..", "uploads");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const fileExtension = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension);
    },
});

const fileUploader = multer({ storage: storage });
const uploadMultipleImage = fileUploader.array("files", 5);
module.exports = uploadMultipleImage;
