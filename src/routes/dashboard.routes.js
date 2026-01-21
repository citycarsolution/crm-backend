const express = require("express");
const router = express.Router();

/*
  ABHI KE LIYE SIMPLE TEST
  role model baad me add karenge
*/

router.get("/", (req, res) => {
  res.json({
    message: "Dashboard route working",
  });
});

module.exports = router;
