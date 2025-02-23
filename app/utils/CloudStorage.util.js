const path = require("path");
const { CLOUDNARY } = require("../config/storage.conf");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: CLOUDNARY.CLOUD_NAME,
  api_key: CLOUDNARY.API_KEY,
  api_secret: CLOUDNARY.API_SECRET,
  secure: true,
});

const uploadFileToCloudinary = (fileName) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, "..", "uploads", fileName);
    cloudinary.uploader.upload(filePath, (error, result) => {
      console.log(result, error);
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

const CloudStorage = {
  fileUpload: uploadFileToCloudinary,
};

module.exports = CloudStorage;
