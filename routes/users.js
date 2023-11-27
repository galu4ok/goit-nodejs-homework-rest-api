const express = require("express");

const { registerUser, loginUser, logoutUser, getCurrentUser } = require("../controllers/auth");

const { validateBody, authenticate } = require("../middlewares");
const { schemas } = require("../models/user");

const router = express.Router();
const parseJSON = express.json();

// Register a user
router.post("/register", parseJSON, validateBody(schemas.registerSchema), registerUser);

// Login a user
router.post("/login", parseJSON, validateBody(schemas.loginSchema), loginUser);

// Logout a user
router.post("/logout", parseJSON, authenticate, logoutUser);

// Current user
router.get("/current", parseJSON, authenticate, getCurrentUser);

module.exports = router;
