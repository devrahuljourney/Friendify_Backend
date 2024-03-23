const express = require("express");
const { createPost, editPost, deletePost, getPost, getFeedFromFollower, getFeedFromAllUsers, getAllPostsFromUser } = require("../controllers/Post");
const { auth } = require("../middlewares/auth");

const router = express.Router();

router.post("/createpost", auth, createPost);
 router.post("/editpost/:postId", auth, editPost);
 router.delete("/deletepost/:postId", auth, deletePost);
 router.get('/getallpost/:userId', getAllPostsFromUser)
 router.get("/getpost/:postId",  getPost);
 router.get('/getfeedfromfollower',auth, getFeedFromFollower )
 router.get('/getfeedfromalluser', getFeedFromAllUsers)


module.exports = router;