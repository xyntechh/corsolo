const express = require("express");
const router = express.Router();
const { catchRefferalClicks } = require("../controller/refferal.controller.js");
const authMiddleware = require("../middleware/auth.js")


//PARTNER SINGUP
router.post("/clickCatch", catchRefferalClicks)


module.exports = router;
