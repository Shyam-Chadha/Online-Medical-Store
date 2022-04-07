//require("dotenv").config();
const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");
const lodash = require("lodash");

const app = express();

app.set('view engine','ejs');

app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));


mongoose.connect("mongodb+srv://admin:admin@cluster0.s5t5r.mongodb.net/MajorDb");

const cardSchema = mongoose.Schema({
    img:String,
    title:String,
    price:String,
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

const cardmodel = mongoose.model("car",cardSchema);

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
        res.render("Admin");
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
    
            const imgSave = new cardmodel({
                img: req.body.image,
                title: lodash.upperCase(req.body.title),
                price:req.body.price,
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

app.get("/queries",function (req,res) {
    
        contactModel.find(function (err,quer) {
            if(quer.length === 0){
                contactModel.insertMany(array,function (err) {
                    if(err){
                        console.log(err);
                    }else{
                        console.log("success");
                    }
                });
                res.redirect("/");
            }  
            else{
                    res.render("queries",{arr:quer});
                }
          }); 
    });


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

app.get("/:medicine",function (req,res) {
    const requested = lodash.lowerCase(req.params.medicine);
    cardmodel.find(function (err,car) {
    car.forEach(function (meds) {
      var saved = lodash.lowerCase(meds.title);
      if(requested === saved ){
        res.render("Single",{
            obj:meds});
    }
})
    });
})

app.post("/",function (req,res) {
    const searched = lodash.upperCase(req.body.search);
    cardmodel.findOne({title:searched} , function (err,found) {
        if(err){
            console.log(err);
        }
        else{
            if(found){
                    res.redirect("/" + searched);
            }
            else{
                res.redirect("/");
            }
        }
    })
})

app.get("/",function (req,res) {
    
    cardmodel.find(function (err,car) {
        if(car.length === 0){
            cardmodel.insertMany(array,function (err) {
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








let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
    console.log("Successfully started the server");
});