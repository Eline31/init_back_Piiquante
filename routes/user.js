const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const emailCtrl = require("../middleware/email_control");
const passwordCtrl = require("../middleware/password_control");

router.post("/signup", emailCtrl, passwordCtrl, userCtrl.signup);
router.post("/login", userCtrl.login);
//Middleware password à créer

module.exports = router;