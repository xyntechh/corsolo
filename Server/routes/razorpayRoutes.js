const express = require("express");
const bodyParser = require("body-parser");
const { createPaymentLink, razorpayWebhook, createPaymentLinkForEBook, razorWebhookforEbook, createPaymentLinkForValantine, razorWebhookforValantine } = require("../controller/razapay.controller.js");
const authMiddleware = require("../middleware/auth.js")

const router = express.Router();

// RAZORPAY WEBHOOK ROUTES
router.post(
  "/razorpay/webhook",
  bodyParser.json({ verify: (req, res, buf) => (req.rawBody = buf) }),
  razorpayWebhook
);

router.post(
  "/razorpay/webhook-ebook",
  bodyParser.json({ verify: (req, res, buf) => (req.rawBody = buf) }),
  razorWebhookforEbook
);


router.post(
  "/razorpay/valentine",
  bodyParser.json({ verify: (req, res, buf) => (req.rawBody = buf) }),
  razorWebhookforValantine
);

// PAYMENT LINK ROUTES 
router.post("/razorpay/payment-link", authMiddleware, createPaymentLink);
router.post("/razorpay/ebook-payment-link", createPaymentLinkForEBook);
router.post("/razorpay/valentine-payment-link", createPaymentLinkForValantine);




module.exports = router;
