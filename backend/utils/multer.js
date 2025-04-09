const multer = require("multer");
const path = require("path");

module.exports = multer({
    limits: { fileSize: 100 * 1024 * 1024 }, // Limit file size to 100MB
    storage: multer.memoryStorage(), // Store files in memory
    fileFilter: (req, file, cb) => {
        console.log("Uploaded file:", file); // Debugging log
        let ext = path.extname(file.originalname).toLowerCase();
        if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
            cb(new Error("Unsupported file type!"), false);
            return;
        }
        cb(null, true);
    },
});
