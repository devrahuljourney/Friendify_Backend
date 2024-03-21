const express = require("express");
const { login, signup, sendOTP } = require("../controllers/Auth");
const router = express.Router();



router.post('/login',login);
router.post('/signup', signup);
router.post('/sendotp', sendOTP);


module.exports = router;