const express = require("express");
const { auth } = require("../middlewares/auth");
const { createLike, deleteLike } = require("../controllers/Like");
const router = express.Router();

router.post("/createlike/:postId", auth, createLike);
router.delete('/deletelike/:likeId', auth, deleteLike);

module.exports = router;