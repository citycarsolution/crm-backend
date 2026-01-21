const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

/**
 * @param {Object} params
 * @param {Object} params.invoice
 * @param {string} params.pdfPath
 */
const generateInvoicePdf = async ({ invoice, pdfPath }) => {
  try {
    /* ===== LOAD HTML TEMPLATE ===== */
    const templatePath = path.join(__dirname, "../templates/invoice.html");
    let html = fs.readFileSync(templatePath, "utf8");

    /* ===== SAFE SERVICES ARRAY ===== */
    const services = Array.isArray(invoice.services)
      ? invoice.services
      : [];

    const serviceRows = services
      .map(
        (s) => `
        <tr>
          <td>${s.name}</td>
          <td style="text-align:right;">₹${s.amount}</td>
        </tr>
      `
      )
      .join("");

    /* ===== REPLACE VARIABLES ===== */
    html = html
      // 🔥 LOGO FIX (STATIC PUBLIC)
      .replaceAll("{{LOGO_URL}}", "http://localhost:5000/logo.png")

      .replaceAll("{{INVOICE_NO}}", invoice.invoiceNo)
      .replaceAll(
        "{{DATE}}",
        new Date(invoice.createdAt || Date.now()).toLocaleDateString()
      )
      .replaceAll("{{CLIENT_NAME}}", invoice.client || "")
      .replaceAll("{{CLIENT_PHONE}}", invoice.phone || "")
      .replaceAll("{{CLIENT_EMAIL}}", invoice.email || "")
      .replaceAll("{{SERVICE_ROWS}}", serviceRows)
      .replaceAll("{{SUBTOTAL}}", invoice.amount || 0)
      .replaceAll("{{GST}}", invoice.gst || 0)
      .replaceAll("{{TOTAL}}", invoice.total || 0);

    /* ===== ENSURE PDF FOLDER ===== */
    fs.mkdirSync(path.dirname(pdfPath), { recursive: true });

    /* ===== LAUNCH PUPPETEER ===== */
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "networkidle0" });

    /* ===== GENERATE PDF ===== */
    await page.pdf({
      path: pdfPath,
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        right: "15mm",
        bottom: "20mm",
        left: "15mm",
      },
    });

    await browser.close();

    console.log("✅ Invoice PDF generated:", pdfPath);
  } catch (err) {
    console.error("❌ Invoice PDF Error:", err);
    throw err;
  }
};

module.exports = generateInvoicePdf;
