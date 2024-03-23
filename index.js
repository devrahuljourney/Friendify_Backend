const express = require("express");
const app = express();

const userRoutes = require("./route/User"); 
const postRoutes = require('./route/Post')
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
	fileUpload({
		useTempFiles:true,
		tempFileDir:"/tmp",
	})
)
cloudinaryConnect();

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/post", postRoutes);


app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`);
});
