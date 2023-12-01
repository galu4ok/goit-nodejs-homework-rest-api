const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");

const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("node:fs/promises");
const gravatar = require("gravatar");
const Jimp = require("jimp");

const { User } = require("../models/user");

const { ctrlWrapper, HttpError, sendEmail } = require("../helpers");

const { JWT_SECRET, BASE_URL } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

// Registration

const registerUser = async (req, res) => {
  const { password, email } = req.body;
  const user = await User.findOne({ email }).exec();

  if (user !== null) {
    throw HttpError(409, "Email in use");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();

  const avatarURL = gravatar.url(email);

  const newUser = await User.create({
    ...req.body,
    password: passwordHash,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<p>Please verify you email by clicking on the <a target="_blanc" href="${BASE_URL}/users/verify/${verificationToken}">link</a></p>`,
    text: `Please verify you email by opening the link http://${BASE_URL}/users/verify/${verificationToken}`,
  };
  await sendEmail(verifyEmail);

  res.status(201).json({ user: { email: newUser.email, subscription: newUser.subscription } });
};

// Verification

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken }).exec();

  if (user === null) {
    throw HttpError(404, "User not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  res.status(200).json({
    message: "Verification successful",
  });
};

// Resend email for verification

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email }).exec();

  if (user === null) {
    throw HttpError(401, "Email not found");
  }

  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<p>Please verify you email by clicking on the <a target="_blanc" href="${BASE_URL}/users/verify/${user.verificationToken}">link</a></p>`,
    text: `Please verify you email by opening the link http://${BASE_URL}/users/verify/${user.verificationToken}`,
  };
  await sendEmail(verifyEmail);

  res.status(200).json({
    message: "Verification email sent",
  });
};

// Login

const loginUser = async (req, res) => {
  const { password, email } = req.body;
  const user = await User.findOne({ email }).exec();

  if (user === null) {
    throw HttpError(401, "Email or password is wrong");
  }
  if (!user.verify) {
    throw HttpError(401, "Email not verified");
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
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  loginUser: ctrlWrapper(loginUser),
  logoutUser: ctrlWrapper(logoutUser),
  getCurrentUser: ctrlWrapper(getCurrentUser),
  subscribeUser: ctrlWrapper(subscribeUser),
  uploadAvatar: ctrlWrapper(uploadAvatar),
};
