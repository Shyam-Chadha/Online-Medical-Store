//require("dotenv").config();
const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();

app.set('view engine','ejs');

app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));


mongoose.connect("mongodb://localhost:27017/MajorDb");

const imgSchema = mongoose.Schema({
    img:String,
    title:String,
    subtitle:String,
    summary:String
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const contactSchema = new mongoose.Schema({
    name:String,
    email:String,
    subject:String,
    message:String
})
const User = new mongoose.model("User", userSchema);

const imgmodel = mongoose.model("car",imgSchema);

const contactModel = mongoose.model("contact" , contactSchema);


app.get("/Contact-Us", function (req,res) {
    res.render("Contact");
})

app.post("/Contact-Us", function (req,res) {
    const contact = new contactModel({
        name: req.body.name,
        email: req.body.email,
        subject:req.body.subject,
        message:req.body.message
    });

        contact.save(function (err) {
        if(err){
        console.log(err);
        }
        else{
        res.redirect("/");
    }
});
})

app.get("/login",function (req,res) {
    res.render("login");
})

app.get("/admin",function (req,res) {
        res.render("admin");
});

// app.get("/register",function (req,res) {
//     res.render("register");
// })

// app.post("/register",function (req,res) {
//     const newUser = new User({
//         email : req.body.username,
//         password : md5(req.body.password),
//     });

//     newUser.save(function (err) {
//         if(err){
//             console.log(err);
//         }
//         else{
//             res.redirect("/");
//         }
//     });
// })

app.post("/admin",function (req,res) {
    
            const imgSave = new imgmodel({
                img: req.body.image,
                title: req.body.title,
                subtitle:req.body.subtitle,
                summary:req.body.Description
            });
    
                imgSave.save(function (err) {
                if(err){
                console.log(err);
                }
                else{
                res.redirect("/");
            }
        });
    })

app.post("/login",function (req,res) {
    const username = req.body.username;
    const password = md5(req.body.password);

    User.findOne({email:username} , function (err,found) {
        if(err){
            console.log(err);
        }
        else{
            if(found){
                if(password === found.password){
                    res.redirect("/admin");
                }
            }
        }
    })
});

app.get("/",function (req,res) {
    
    imgmodel.find(function (err,car) {
        if(car.length === 0){
            imgmodel.insertMany(array,function (err) {
                if(err){
                    console.log(err);
                }else{
                    console.log("success");
                }
            });
            res.redirect("/");
        }  
        else{
                res.render("main",{arr:car});
            }
      }); 
});










app.listen(3000, function () {
    console.log("Successfully started port 3000");
});