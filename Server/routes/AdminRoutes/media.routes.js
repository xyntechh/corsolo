const express = require("express");
const router = express.Router();
const { getAllMedia } = require("../../controller/AdminController/media.controller");
const Authmiddleware = require("../../middleware/auth")


router.get("/getAllMedia", Authmiddleware, getAllMedia)





module.exports = router;
