const express = require("express");
const { auth } = require("../middlewares/auth");
const { createComment, deleteComment } = require("../controllers/Commet");
const router = express.Router();

router.post("/createcomment/:postId", auth, createComment);
router.delete('/deletecomment/:commentId', auth, deleteComment);

module.exports = router;