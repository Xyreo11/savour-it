const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Schema/UserSchema");
const RegisterController = require("../controllers/RegisterController");

const verifyToken = require("../Middleware/middleware");

router.post("/register", RegisterController, verifyToken);


module.exports = router;
