const express = require("express");
const searchBasicOnKeywords = require("../controllers/Search");
const { auth } = require("../middlewares/auth");

const router = express.Router();


router.get("/search" , auth, searchBasicOnKeywords);
module.exports = router;
