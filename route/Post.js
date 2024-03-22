const express = require("express");
const { createPost } = require("../controllers/Post");
const { auth } = require("../middlewares/auth");

const router = express.Router();

router.post("/createpost", auth, createPost);

module.exports = router;