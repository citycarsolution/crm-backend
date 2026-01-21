const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/User");

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const hash = await bcrypt.hash("admin123", 10);

  await User.create({
    firstName: "Super",
    lastName: "Admin",
    email: "admin@3arrowcrm.com",
    password: hash,
    role: "admin",
  });

  console.log("✅ Admin created");
  process.exit();
})();
