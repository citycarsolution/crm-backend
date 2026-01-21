const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const {
  login,
  createUser,
} = require("../controllers/auth.controller");

/* ===== LOGIN ===== */
router.post("/login", login);

/* ===== CREATE USER (ADMIN ONLY) ===== */
router.post("/create-user", auth, role("admin"), createUser);

module.exports = router;
