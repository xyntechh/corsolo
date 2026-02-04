const express = require("express");
const router = express.Router();
const { partnerStats, RecentJoinPartner, getPartnerById } = require("../../controller/AdminController/partner.controller");
const Authmiddleware = require("../../middleware/auth")

router.get("/partnerStats", Authmiddleware, partnerStats)
router.get("/RecentJoinPartner", Authmiddleware, RecentJoinPartner)
router.get("/getPartnerByid/:id", Authmiddleware, getPartnerById)





module.exports = router;
