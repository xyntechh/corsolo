const express = require("express");
const router = express.Router();
const { getServerStats } = require("../../controller/AdminController/server-stats.controller.js");

router.get("/getServerStats", getServerStats);



module.exports = router;
