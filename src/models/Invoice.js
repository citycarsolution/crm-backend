const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNo: { type: String, required: true },
    client: { type: String, required: true },
    phone: String,
    email: String,

    // 🔥 ADD THIS (VERY IMPORTANT)
    services: [
      {
        name: String,
        amount: Number,
      },
    ],

    amount: Number,
    gst: Number,
    total: Number,
    status: { type: String, default: "Unpaid" },
    pdfUrl: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
