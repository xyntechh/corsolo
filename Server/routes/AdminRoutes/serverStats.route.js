const express = require("express");
const router = express.Router();
const { getServerStats , mongoStats, cleanMongoStorage} = require("../../controller/AdminController/server-stats.controller.js");
const Authmiddleware = require("../../middleware/auth.js");


router.get("/getServerStats", Authmiddleware, getServerStats);
router.get("/mongoStats",  mongoStats);
router.delete("/cleanMongoStorage",  cleanMongoStorage);



module.exports = router;
