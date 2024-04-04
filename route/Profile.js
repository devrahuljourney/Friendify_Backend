const express = require("express");
const router = express.Router();
const { createProfile, deleteProfile, getProfile, followUser, unfollowUser, getProfileById } = require("../controllers/Profile");
const { auth } = require("../middlewares/auth");

router.post("/createprofile", auth, createProfile);
router.delete("/deleteprofile", auth, deleteProfile);
router.get("/getprofile", auth, getProfile);
router.get("/getprofilebyid/:userId", auth, getProfileById);
router.post("/follow/:userId", auth, followUser );
router.post("/unfollow/:userId", auth, unfollowUser)

module.exports = router;
