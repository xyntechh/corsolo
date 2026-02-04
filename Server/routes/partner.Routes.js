const express = require("express");
const router = express.Router();
const { createPartner,
    loginPartner,
    getInformation } = require("../controller/partner.controller.js");
const authMiddleware = require("../middleware/auth.js")


//PARTNER SINGUP
router.post("/Singup", createPartner)
router.post("/login", loginPartner)
router.get("/getInformation", authMiddleware, getInformation)


module.exports = router;
