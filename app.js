require("dotenv").config();
const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const lodash = require("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(
  "mongodb://localhost:27017/FirstCare"
);

const cardSchema = mongoose.Schema({
  img: String,
  title: String,
  price: String,
  summary: String,
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

const cardmodel = mongoose.model("car", cardSchema);

const contactModel = mongoose.model("contact", contactSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function (req, res) {
  cardmodel.find(function (err, car) {
    if (car.length === 0) {
      cardmodel.insertMany(array, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("success");
        }
      });
      res.redirect("/");
    } else {
      res.render("main", { arr: car });
    }
  });
});

app.post("/", function (req, res) {
  const searched = lodash.upperCase(req.body.search);
  cardmodel.findOne({ title: searched }, function (err, found) {
    if (err) {
      console.log(err);
    } else {
      if (found) {
        res.redirect("/" + searched);
      } else {
        res.redirect("/");
      }
    }
  });
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  const { username, password } = req.body;
  User.register({ username: username }, password, (err, user) => {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/");
      });
    }
  });
});

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/login");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.post("/login", function (req, res) {
  const { username, password } = req.body;
  const user = new User({
    username: username,
    password: password,
  });

  req.login(user, (err) => {
    if (err) {
      console.log(err);
      res.redirect("/signin");
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/admin");
      });
    }
  });
});

app.get("/admin", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("Admin");
  } else {
    res.redirect("/login");
  }
});

app.post("/admin", function (req, res) {
  const imgSave = new cardmodel({
    img: req.body.image,
    title: lodash.upperCase(req.body.title),
    price: req.body.price,
    summary: req.body.Description,
  });

  imgSave.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

app.get("/queries", function (req, res) {
  if (req.isAuthenticated()) {
    contactModel.find(function (err, quer) {
      if (quer.length === 0) {
        contactModel.insertMany(array, function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("success");
          }
        });
        res.redirect("/");
      } else {
        res.render("queries", { arr: quer });
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/Contact-Us", function (req, res) {
  res.render("Contact");
});

app.post("/Contact-Us", function (req, res) {
  const contact = new contactModel({
    name: req.body.name,
    email: req.body.email,
    subject: req.body.subject,
    message: req.body.message,
  });

  contact.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

app.get("/:medicine", function (req, res) {
  const requested = lodash.lowerCase(req.params.medicine);
  cardmodel.find(function (err, car) {
    car.forEach(function (meds) {
      var saved = lodash.lowerCase(meds.title);
      if (requested === saved) {
        res.render("Single", {
          obj: meds,
        });
      }
    });
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Successfully started the server");
});
