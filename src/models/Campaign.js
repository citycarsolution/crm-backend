const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    name: String,
    client: String,
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
    },
    status: {
      type: String,
      default: "Active",
    },
    spend: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Campaign", campaignSchema);
