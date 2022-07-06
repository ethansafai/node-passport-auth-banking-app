const LocalStrategy = require("passport-local").Strategy;
const authenticateUser = require("../authenticateUser");
const User = require("../models/User");

function initialize(passport) {
  const authMiddleware = async (username, password, done) => {
    try {
      const user = await authenticateUser(username, password);
      if (user && !user.usernameError && !user.passwordError) {
        return done(null, user);
      } else if (user.usernameError) {
        return done(null, false, { message: "Incorrect username" });
      } else {
        return done(null, false, { message: "Incorrect password" });
      }
    } catch (e) {
      return done(e);
    }
  };

  passport.use(
    new LocalStrategy(
      { usernameField: "username", passwordField: "password" },
      authMiddleware
    )
  );
  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
  });
}

module.exports = initialize;
