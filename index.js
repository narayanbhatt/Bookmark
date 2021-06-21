const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute=require("./routes/users");
const authRoute=require("./routes/auth.js");

dotenv.config();

//mongoose connect
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true}, ()=>{
    console.log("MongoDB is connected");
    
    b="mongodb+srv://BookmarkDatabase:internship2021@cluster0.hwouu.mongodb.net/Bookmark?retryWrites=true&w=majority";
    console.log(process.env.MONGO_URL==b);
});

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.get("/", (req, res)=>{
    res.send("Welcome to homepage")
})

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);

app.listen(8800, ()=>{
    console.log("backend server is running");
})