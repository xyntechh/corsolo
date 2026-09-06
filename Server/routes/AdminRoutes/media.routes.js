const express = require("express");
const router = express.Router();
const { getAllMedia, deleteMedia } = require("../../controller/AdminController/media.controller");
const Authmiddleware = require("../../middleware/auth")


router.get("/getAllMedia", Authmiddleware, getAllMedia)
router.delete("/deleteMedia", Authmiddleware, deleteMedia)




module.exports = router;
