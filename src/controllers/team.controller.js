const User = require("../models/User");

/* ================= GET TEAM ================= */
exports.getTeam = async (req, res) => {
  const { role, email } = req.user;

  let query = { isDeleted: false };

  // 🔐 ROLE-BASED FILTERING
  if (role === "manager") {
    query.role = "employee";
  }

  if (role === "employee") {
    query.email = email;
  }

  const team = await User.find(query).sort({ createdAt: -1 });

  // ✅ ALWAYS RETURN ARRAY
  res.json(team);
};

/* ================= ADD MEMBER (ADMIN) ================= */
exports.addMember = async (req, res) => {
  const exists = await User.findOne({ email: req.body.email });
  if (exists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create(req.body);
  res.status(201).json(user);
};

/* ================= UPDATE MEMBER ================= */
exports.updateMember = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(user);
};

/* ================= CHANGE STATUS ================= */
exports.changeStatus = async (req, res) => {
  const { status } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.status = status;
  await user.save();

  res.json({ success: true });
};

/* ================= FORCE LOGOUT ================= */
exports.forceLogout = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, {
    forceLogoutAt: new Date(),
  });

  res.json({ success: true });
};

/* ================= SOFT DELETE ================= */
exports.deleteMember = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, {
    isDeleted: true,
    status: "blocked",
  });

  res.json({ success: true });
};

/* ================= SELF PROFILE ================= */
exports.me = async (req, res) => {
  const user = await User.findOne({
    email: req.user.email,
    isDeleted: false,
  });

  res.json(user);
};
