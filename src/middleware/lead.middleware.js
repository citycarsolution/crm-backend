const Lead = require("../models/Lead");

module.exports = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    req.lead = lead;
    next();
  } catch {
    res.status(400).json({ message: "Invalid lead id" });
  }
};
