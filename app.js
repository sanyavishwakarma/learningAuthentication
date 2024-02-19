require('dotenv').config();
let express = require("express");
let ejs = require("ejs");
let bodyParser = require("body-parser");
let mongoose = require("mongoose");
let encrypt = require("mongoose-encryption");

let app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended : true}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

// create schema template
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(encrypt, {secret : process.env.SECRET, encryptedFields : ["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res)=>{
    res.render("home");
});

app.get("/login", (req, res)=>{
    res.render("login");
});

app.post("/login", async (req, res) => {
    const username = req.body.username;
    const pwd = req.body.password;

    const foundUser = await User.findOne({email : username});
    if(foundUser.password === pwd){
        res.render("secrets");
    }
});

app.get("/register", (req, res)=>{
    res.render("register");
});

app.post("/register", async (req, res)=>{
    const newUser = new User({
        email : req.body.username,
        password : req.body.password
    });

    if(newUser == await newUser.save()){
        res.render("secrets");
    }
});

app.get("/submit", (req, res)=>{
    res.render("submit");
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});