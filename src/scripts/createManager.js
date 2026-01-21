const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/User"); // ✅ same User model

async function createManager() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = "manager@3arrowcrm.com";
    const password = "manager123";

    const exists = await User.findOne({ email });
    if (exists) {
      console.log("⚠️ Manager already exists");
      process.exit();
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      firstName: "CRM",
      lastName: "Manager",
      email,
      password: hashed,
      role: "manager",
      status: "active",
    });

    console.log("✅ Manager created");
    console.log("📧 Email:", email);
    console.log("🔑 Password:", password);

    process.exit();
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

createManager();
