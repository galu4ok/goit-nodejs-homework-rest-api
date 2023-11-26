const express = require("express");

const { registerUser } = require("../../controllers/auth");

const { validateBody } = require("../../middlewares");
const { schemas } = require("../../models/user");

const router = express.Router();
const parseJSON = express.json();

// Register a user
router.post("/register", parseJSON, validateBody(schemas.registerSchema), registerUser);

module.exports = router;
