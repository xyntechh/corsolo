const express = require("express");
const router = express.Router();
const { signUpAdmin , loginAdmin } = require("../../controller/AdminController/admin.auth.controller");


router.post("/addAdmin", signUpAdmin)
router.post("/login", loginAdmin)



module.exports = router;
