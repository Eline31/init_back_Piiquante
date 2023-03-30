const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const emailCtrl = require("../middleware/email_control");
const passwordCtrl = require("../middleware/password_control");

/**Les différentes routes utilisateurs et leurs middlewares */
router.post("/signup", emailCtrl, passwordCtrl, userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;