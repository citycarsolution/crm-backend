const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");

// ================= ENV =================
dotenv.config();

// ================= DB ==================
connectDB();

const app = express();

// ================= MIDDLEWARE ==========
app.use(cors());
app.use(express.json());

// ================= STATIC FILES =================

// 🔥 PUBLIC ASSETS (logo.png, images, etc.)
app.use(express.static(path.join(__dirname, "../public")));

// 🔥 INVOICE PDFs ACCESS
app.use(
  "/invoices",
  express.static(path.join(__dirname, "../public/invoices"))
);

// ================= ROUTES =================
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/leads", require("./routes/lead.routes"));
app.use("/api/campaigns", require("./routes/campaign.routes"));
app.use("/api/invoices", require("./routes/invoice.routes"));
app.use("/api/team", require("./routes/team.routes"));
app.use("/api/dashboard", require("./routes/dashboard.routes"));


// ================= ROOT TEST =================
app.get("/", (req, res) => {
  res.status(200).send("✅ Backend running with MongoDB 🚀");
});

// ================= GLOBAL ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
