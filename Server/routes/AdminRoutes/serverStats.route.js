const express = require("express");
const router = express.Router();
const { getServerStats } = require("../../controller/AdminController/server-stats.controller.js");
const Authmiddleware = require("../../middleware/auth.js");


router.get("/getServerStats", Authmiddleware, getServerStats);



module.exports = router;
