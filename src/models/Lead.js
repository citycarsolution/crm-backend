const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema(
  {
    business: String,
    userName: String,
    phone: String,
    email: String,
    website: String,
    city: String,
    state: String,
    country: String,
    category: String,

    services: [
      {
        name: String,
        baseAmount: Number,
        amount: Number,
        maintenance: String,
        gst: Boolean,
        paymentMode: String,
      },
    ],

    status: {
      type: String,
      enum: ["Pending Payment", "Approved", "Rejected"],
      default: "Pending Payment",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", LeadSchema);
