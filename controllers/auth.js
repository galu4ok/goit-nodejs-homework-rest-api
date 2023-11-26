const bcrypt = require("bcrypt");

const { User } = require("../models/user");

const { ctrlWrapper, HttpError } = require("../helpers");

// Registration

const registerUser = async (req, res) => {
  const { password, email } = req.body;
  const user = await User.findOne({ email }).exec();

  if (user !== null) {
    throw HttpError(409, "Email in use");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: passwordHash });
  res.status(201).json({ user: { email: newUser.email, subscription: newUser.subscription } });
};

module.exports = { registerUser: ctrlWrapper(registerUser) };
