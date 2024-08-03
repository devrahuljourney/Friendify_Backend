const express = require("express");
const { auth } = require("../middlewares/auth");
const { sendMessage, getMessage, getMessagedUser,  } = require("../controllers/Message");

const Router = express.Router();
Router.post("/send-message", auth, sendMessage );
Router.get("/get-message/:senderId/:receiverId", auth, getMessage);
Router.get("/get-messaged-user/:senderId", auth, getMessagedUser)

module.exports = Router;