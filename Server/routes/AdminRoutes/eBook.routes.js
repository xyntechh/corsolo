const express = require("express");
const router = express.Router();
const { getAllEbooksOrder, getDashboardStats } = require("../../controller/AdminController/eBook.controller");
const Authmiddleware = require("../../middleware/auth")


router.get("/getAllEbookOrder", Authmiddleware, getAllEbooksOrder)
router.get("/getDashboardStats", Authmiddleware, getDashboardStats)







module.exports = router;
