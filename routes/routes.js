// Description: This file contains all the routes for the application
const express = require("express"),
  router = express.Router(),
  appController = require("../controllers/appController.js"),
  multer = require("multer");

// File Storage Engine
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});
// Init Upload
const upload = multer({ storage: fileStorageEngine });

// Application Routes
router.post("/", upload.single("image"), appController.uploadCard);
router.get("/", appController.uploadCardGet);
module.exports = router;
