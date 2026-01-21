const Lead = require("../models/Lead");
const Invoice = require("../models/Invoice");
const Campaign = require("../models/Campaign");
const path = require("path");

// 🔥 PDF generator (utility)
const generateInvoicePdf = require("../utils/invoicePdf");

/* ================= CREATE LEAD ================= */
exports.createLead = async (req, res) => {
  try {
    const lead = await Lead.create({
      ...req.body,
      status: "Pending Payment",
    });

    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET LEADS ================= */
exports.getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= APPROVE LEAD (MASTER FLOW) ================= */
exports.approveLead = async (req, res) => {
  try {
    const lead = req.lead; // middleware se aata hai

    if (lead.status === "Approved") {
      return res
        .status(400)
        .json({ message: "Lead already approved" });
    }

    /* ===== 1️⃣ CALCULATE AMOUNT ===== */
    const subtotal = lead.services.reduce(
      (sum, s) => sum + Number(s.amount || 0),
      0
    );

    const gstAmount = lead.gst ? Math.round(subtotal * 0.18) : 0;
    const total = subtotal + gstAmount;

    /* ===== 2️⃣ GENERATE INVOICE NO ===== */
    const invoiceNo = `INV-${Date.now()}`;
    const fileName = `${invoiceNo}.pdf`;

    const pdfPath = path.join(
      __dirname,
      "../../public/invoices",
      fileName
    );

    /* ===== 3️⃣ CREATE INVOICE (DB) ===== */
    const invoice = await Invoice.create({
      invoiceNo,
      client: lead.business,
      phone: lead.phone,
      email: lead.email,
      services: lead.services,
      amount: subtotal,
      gst: gstAmount,
      total,
      status: "Unpaid",
      pdfUrl: `/invoices/${fileName}`,
    });

    /* ===== 4️⃣ GENERATE PDF ===== */
    await generateInvoicePdf({
      invoice,
      pdfPath,
    });

    /* ===== 5️⃣ CREATE CAMPAIGN ===== */
    await Campaign.create({
      name: `${lead.business} Campaign`,
      client: lead.business,
      status: "Active",
    });

    /* ===== 6️⃣ UPDATE LEAD STATUS ===== */
    lead.status = "Approved";
    await lead.save();

    /* ===== 7️⃣ FUTURE AUTOMATION HOOKS ===== */
    // sendInvoiceEmail(invoice);
    // sendInvoiceWhatsApp(invoice);

    res.json({
      message: "Lead approved & invoice generated",
      invoiceId: invoice._id,
      pdfUrl: invoice.pdfUrl,
    });
  } catch (err) {
    console.error("Approve Lead Error:", err);
    res.status(500).json({ message: err.message });
  }
};
