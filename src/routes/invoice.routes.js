const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const Invoice = require("../models/Invoice");

router.get("/", auth, async (req, res) => {
  const invoices = await Invoice.find().sort({ createdAt: -1 });
  res.json(invoices);
});

router.get("/:id", auth, async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  res.json(invoice);
});

module.exports = router;
