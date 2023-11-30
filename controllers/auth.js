const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("node:fs/promises");
const gravatar = require("gravatar");
const Jimp = require("jimp");

const { User } = require("../models/user");

const { ctrlWrapper, HttpError } = require("../helpers");

const { JWT_SECRET } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

// Registration

const registerUser = async (req, res) => {
  const { password, email } = req.body;
  const user = await User.findOne({ email }).exec();

  if (user !== null) {
    throw HttpError(409, "Email in use");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const avatarURL = gravatar.url(email);

  const newUser = await User.create({ ...req.body, password: passwordHash, avatarURL });
  res.status(201).json({ user: { email: newUser.email, subscription: newUser.subscription } });
};

// Login

const loginUser = async (req, res) => {
  const { password, email } = req.body;
  const user = await User.findOne({ email }).exec();

  if (user === null) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (passwordCompare === false) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" }); // token expires in 24 hours

  await User.findByIdAndUpdate(user._id, { token }).exec();

  res.status(200).json({ token, user: { email: user.email, subscription: user.subscription } });
};

// Logout

const logoutUser = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null }).exec();
  res.status(204).json({
    message: "Logout success",
  });
};

// Current user

const getCurrentUser = async (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({ email, subscription });
};

// Subscription

const subscribeUser = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;

  const updatedUser = await User.findByIdAndUpdate(_id, { subscription }, { new: true }).exec();
  if (updatedUser === null) {
    throw HttpError(404);
  }

  res.status(200).json({
    user: {
      email: updatedUser.email,
      subscription: updatedUser.subscription,
    },
  });
};

// Upload avatar
const uploadAvatar = async (req, res) => {
  if (!req.file) throw HttpError(400, "Avatar must be uploaded");

  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  console.log(req.file);

  // Зміна розміру аватарки
  const avatar = await Jimp.read(tempUpload);
  await avatar.resize(250, 250).quality(60).write(tempUpload);

  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);
  await fs.rename(tempUpload, resultUpload);

  const avatarURL = path.join("avatars", filename);

  const user = await User.findByIdAndUpdate(_id, { avatarURL }, { new: true }).exec();
  if (user === null) {
    throw HttpError(404, "User not found");
  }

  res.status(200).json({ avatarURL });
};

module.exports = {
  registerUser: ctrlWrapper(registerUser),
  loginUser: ctrlWrapper(loginUser),
  logoutUser: ctrlWrapper(logoutUser),
  getCurrentUser: ctrlWrapper(getCurrentUser),
  subscribeUser: ctrlWrapper(subscribeUser),
  uploadAvatar: ctrlWrapper(uploadAvatar),
};
