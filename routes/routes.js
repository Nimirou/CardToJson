const express = require("express");
const router = express.Router();
const appController = require("../controllers/appController.js");

// Application Routes

router.post("/", appController.uploadCard);

module.exports = router;
