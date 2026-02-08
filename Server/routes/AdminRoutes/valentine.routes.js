const express = require("express");
const router = express.Router();
const Authmiddleware = require("../../middleware/auth")
const { getAllValentineOrder, getValentineCard } = require("../../controller/AdminController/valantine.controller")

router.get("/getAllValentineOrder", getAllValentineOrder)
router.get("/getValentineCard", getValentineCard)






module.exports = router;
