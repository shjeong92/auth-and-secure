//jshint esversion:6]
require("dotenv").config();
const express = require("express");
const bodyParser =require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");
const md5 = require("md5");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended : true}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});
const userSchema = new mongoose.Schema ({
  email : String,
  password : String
});
console.log(process.env.SECRET);

console.log(md5("123456"));


const User = new mongoose.model("User",userSchema);

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   console.log("Connected!");
// });
app.get("/", function(req,res){
  res.render("home");
});

app.get("/login", function(req,res){
  res.render("login");
});

app.get("/register", function(req,res){

  res.render("register");
});

app.post("/register", function(req, res) {

  const newUser = User ({
    email : req.body.username,
    password :  md5(req.body.password)
  });
  newUser.save(function(err){
    if(err){
      console.log("Error");
    }
    else {
      res.render("secrets");
    }
  });
});

app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = md5(req.body.password);

  User.findOne({email : username}, function(err, foundUser){
    if(err){
      console.log(err);
    }
    else {
      if(foundUser){
        if(foundUser.password === password){
          res.render("secrets");
        }

      }
    }
  });
});















app.listen(3000,function() {
  console.log("Server started on port 3000");
});
