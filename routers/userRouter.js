const express = require("express");
const router = express.Router();

const {
  registerUser,
  getUser,
  createAdmin,
} = require("../controllers/userController");
const { verifyToken, adminOnly } = require("../Middleware/verifyToken");

router.post("/register", registerUser);
router.post("/create-admin", verifyToken, adminOnly, createAdmin);
router.post("/login", getUser);

module.exports = router;
