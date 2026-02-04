const express = require("express");
const router = express.Router();
const { dashboardStats, recentUser, getUseById } = require("../../controller/AdminController/Dashboard.controller");
const Authmiddleware = require("../../middleware/auth")

router.get("/stats", Authmiddleware, dashboardStats)
router.get("/recentUser", Authmiddleware, recentUser)
router.get("/getUserBy/:id", Authmiddleware, getUseById)



module.exports = router;
