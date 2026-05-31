const express = require("express");
const bodyParser = require("body-parser");
const authMiddleware = require("../middleware/auth.js")
const { createPaymentLink, cashFreeWebhook , createCashfreePaymentLink} = require("../controller/CashfreeController.js");



const router = express.Router();


// CASHFREE PAYMENT LINK ROUTE
router.post("/cashfree/payment-link", authMiddleware, createCashfreePaymentLink);
router.post("/cashfree/paymentwebook", cashFreeWebhook)

module.exports = router;