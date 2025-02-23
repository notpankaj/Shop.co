const cloudinary = require("cloudinary").v2;

cloudinary.v2.config({
  cloud_name: "dyibxim0s",
  api_key: "545187518964825",
  api_secret: "<your_api_secret>",
  secure: true,
});

const uploadFileToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
      "/home/my_image.jpg",
      { upload_preset: "my_preset" },
      (error, result) => {
        console.log(result, error);
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const CloudStorage = {
  fileUpload: uploadFileToCloudinary,
};

module.exports = CloudStorage;
