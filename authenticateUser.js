const bcrypt = require("bcrypt");
const User = require("./models/User");

module.exports = async (username, password) => {
  const user = await User.findOne({ username });
  if (!user) {
    return { usernameError: true };
  }
  if (!(await bcrypt.compare(password, user.password))) {
    return { passwordError: true };
  }
  return user;
};
