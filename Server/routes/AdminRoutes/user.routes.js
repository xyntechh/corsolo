const express = require("express");
const router = express.Router();
const { userStats, last7DaysComparisson, avarageUserPerday, getAllsignUpUser } = require("../../controller/AdminController/user.controller");
const Authmiddleware = require("../../middleware/auth")


router.get("/userStats", Authmiddleware, userStats)
router.get("/last7days", Authmiddleware, last7DaysComparisson)
router.get("/avagrageUserPerDay", Authmiddleware, avarageUserPerday)
router.get("/getAllSignUpUser", Authmiddleware, getAllsignUpUser)




module.exports = router;
