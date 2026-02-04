const express = require("express");
const router = express.Router();
const { getPaymentDashboardStats, recentPayment, last7daysPaymetGraph } = require("../../controller/AdminController/payment.controller");
const Authmiddleware = require("../../middleware/auth")


router.get("/getPaymentDashboardStats", Authmiddleware, getPaymentDashboardStats)
router.get("/recentPayment", Authmiddleware, recentPayment)
router.get("/last7daysPaymentGraph", Authmiddleware, last7daysPaymetGraph)







module.exports = router;
