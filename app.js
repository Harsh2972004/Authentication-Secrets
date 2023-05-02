//jshint esversion:6
require("dotenv").config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});



const User = mongoose.model("User", userSchema);

app.get("/", function (req, res) {
    res.render("home");
});

app.route("/register")
    .get(function (req, res) {
        res.render("register");
    })
    .post(function (req, res) {
        bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
            const newUser = new User({
                email: req.body.username,
                password: hash
            });
    
            newUser.save()
                .then(function () {
                    res.render("secrets");
                })
                .catch(function (err) {
                    console.log(err);
                });
        });

        
    });

app.route("/login")
    .get(function (req, res) {
        res.render("login");
    })
    .post(function (req, res) {
        const username = req.body.username;
        const password = req.body.password;

        User.findOne({ email: username })
            .then(function (foundUser) {
                if (foundUser) {
                    bcrypt.compare(password, foundUser.password, function(err, result) {
                        res.render("secrets");
                    });
                }
            })
            .catch(function (err) {
                console.log(err);
            });
    });





app.listen(process.env.PORT || 3000, function () {
    console.log("server started at port 3000.");
});