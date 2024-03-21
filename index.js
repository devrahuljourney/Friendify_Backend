const express = require("express");
const app = express();
const userRoutes = require("./route/User"); // Corrected route file path
const cookieParser = require("cookie-parser");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const db = require("./config/database");
db.connect();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", userRoutes);

app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`);
});
