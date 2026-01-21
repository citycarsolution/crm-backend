const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const leadLoader = require("../middleware/lead.middleware");

const {
  createLead,
  getLeads,
  approveLead,
} = require("../controllers/lead.controller");

router.post("/", auth, createLead);
router.get("/", auth, getLeads);

router.post(
  "/:id/approve",
  auth,
  leadLoader,
  approveLead
);

module.exports = router;
