const express = require("express");
const router = express.Router();

const { registerUser, getUser } = require("../controllers/userController");
const { verifyToken } = require("../Middleware/verifyToken");

router.post("/register", registerUser);

router.get("/login", getUser);

module.exports = router;
