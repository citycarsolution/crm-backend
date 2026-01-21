const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

router.get("/dashboard", auth, role("admin"), (req, res) => {
  res.json({
    message: "Welcome Admin Dashboard",
    user: req.user,
  });
});

module.exports = router;
