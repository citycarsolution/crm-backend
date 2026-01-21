const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/* =========================
   LOGIN
========================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password required" });
    }

    // 2️⃣ User check
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3️⃣ Status check
    if (user.status === "blocked") {
      return res.status(403).json({
        message: "Account blocked. Contact admin.",
      });
    }

    // 4️⃣ Password check
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 5️⃣ JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 6️⃣ Response
    res.json({
      success: true,
      token,
      role: user.role,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   CREATE USER (ADMIN ONLY)
========================= */
exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // 1️⃣ Validation
    if (!firstName || !lastName || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: "All fields are required" });
    }

    // 2️⃣ Role validation
    const allowedRoles = ["admin", "manager", "employee"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // 3️⃣ Existing user check
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 4️⃣ Password hash
    const hash = await bcrypt.hash(password, 10);

    // 5️⃣ Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hash,
      role,
      status: "active", // default
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    console.error("CREATE USER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
