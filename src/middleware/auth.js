const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ message: "No token" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ email: decoded.email });

    if (!user || user.isDeleted) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 🔥 FORCE LOGOUT CHECK
    if (
      user.forceLogoutAt &&
      decoded.iat * 1000 < new Date(user.forceLogoutAt).getTime()
    ) {
      return res.status(401).json({ message: "Session expired" });
    }

    if (
      user.status === "blocked" ||
      user.status === "permanent_block"
    ) {
      return res.status(403).json({ message: "Account blocked" });
    }

    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
