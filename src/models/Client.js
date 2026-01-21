const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema(
  {
    business: String,
    userName: String,
    phone: String,
    email: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Client", ClientSchema);
