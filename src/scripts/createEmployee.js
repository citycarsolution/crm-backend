const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/User");

async function createEmployee() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = "employee@3arrowcrm.com";
    const password = "employee123";

    const exists = await User.findOne({ email });
    if (exists) {
      console.log("⚠️ Employee already exists");
      process.exit();
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      firstName: "CRM",
      lastName: "Employee",
      email,
      password: hashed,
      role: "employee",
      status: "active",
    });

    console.log("✅ Employee created");
    console.log("📧 Email:", email);
    console.log("🔑 Password:", password);

    process.exit();
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

createEmployee();
