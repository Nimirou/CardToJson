const express = require("express");
const router = express.Router();
const appController = require("../controllers/appController.js");
const multer = require("multer");

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

const upload = multer({ storage: fileStorageEngine });

// Application Routes

router.post("/", upload.single("image"), appController.uploadCard);

module.exports = router;
