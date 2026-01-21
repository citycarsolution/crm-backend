const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const { getClients } = require("../controllers/client.controller");

router.get("/", auth, getClients);

module.exports = router;
