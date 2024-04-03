const express = require("express");
const app = express();

const userRoutes = require("./route/User"); 
const postRoutes = require('./route/Post');
const commentRoutes = require('./route/Comment');
const likeRoutes = require('./route/Like');
const profileRoutes = require('./route/Profile');
const cors = require("cors");


const cookieParser = require("cookie-parser");
require("dotenv").config();
const fileUpload = require("express-fileupload");

const PORT = process.env.PORT || 3000;
const db = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");
db.connect();

app.use(express.json());
app.use(cookieParser());

app.use(
	cors({
		origin:"http://localhost:3000",
		credentials:true,
	})
)

app.use(
	fileUpload({
		useTempFiles:true,
		tempFileDir:"/tmp",
	})
)
cloudinaryConnect();

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/comment", commentRoutes);
app.use("/api/v1/like", likeRoutes);
app.use("/api/v1/profile", profileRoutes);





app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`);
});
