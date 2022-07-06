if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const flash = require("express-flash");
const path = require("path");
const passport = require("passport");
const initializePassport = require("./config/passport");
const methodOverride = require("method-override");
const controllers = require("./controllers");

mongoose.connect(process.env.DATABASE_URL);

initializePassport(passport);

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    name: "session-id",
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
};

app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/home");
    return;
  }
  res.render("index");
});

app.post("/signup", controllers.signup);

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/",
    failureFlash: true,
  })
);

app.delete("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.get("/home", checkAuthenticated, controllers.getHome);

app
  .route("/account")
  .post(checkAuthenticated, controllers.createAccount)
  .delete(checkAuthenticated, controllers.deleteAccount);

app.post("/deposit", checkAuthenticated, controllers.depositMoney);

app.post("/transfer", checkAuthenticated, controllers.transferMoney);

app.post("/withdraw", checkAuthenticated, controllers.withdrawMoney);

app.listen(process.env.PORT);
