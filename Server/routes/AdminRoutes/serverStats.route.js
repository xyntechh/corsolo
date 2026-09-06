const express = require("express");
const router = express.Router();
const { getServerStats } = require("../../controller/AdminController/server-stats.controller.js");
import Authmiddleware from "../../middleware/auth.js";

router.get("/getServerStats", Authmiddleware, getServerStats);



module.exports = router;
