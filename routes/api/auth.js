const express = require("express");

const { registerUser, loginUser } = require("../../controllers/auth");

const { validateBody } = require("../../middlewares");
const { schemas } = require("../../models/user");

const router = express.Router();
const parseJSON = express.json();

// Register a user
router.post("/register", parseJSON, validateBody(schemas.registerSchema), registerUser);

// Login a user
router.post("/login", parseJSON, validateBody(schemas.loginSchema), loginUser);

module.exports = router;
