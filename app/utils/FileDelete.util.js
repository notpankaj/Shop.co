const path = require("path");
const fs = require("fs");

const fileDelete = (filename) => {
    const filePath = path.join(__dirname, "..", "uploads", filename);
    fs.unlink(filePath, (err) => {
        if (err) {
            throw new Error(err?.message);
        }
        return true;
    });
};

module.exports = fileDelete;
