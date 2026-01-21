const express = require("express");
const router = express.Router();
const Campaign = require("../models/Campaign");
const auth = require("../middleware/auth.middleware");

router.get("/", auth, async (req, res) => {
  const campaigns = await Campaign.find().sort({ createdAt: -1 });
  res.json(campaigns);
});

module.exports = router;
