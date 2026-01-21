const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

exports.generateInvoicePDF = async (invoice) => {
  const templatePath = path.join(
    __dirname,
    "../templates/invoice.html"
  );

  let html = fs.readFileSync(templatePath, "utf-8");

  const serviceRows = invoice.services
    .map(
      (s) =>
        `<tr><td>${s.name}</td><td>₹${s.amount}</td></tr>`
    )
    .join("");

  html = html
    .replace("{{invoiceNo}}", invoice.invoiceNo)
    .replace("{{date}}", new Date().toLocaleDateString())
    .replace("{{client}}", invoice.client)
    .replace("{{phone}}", invoice.phone)
    .replace("{{email}}", invoice.email)
    .replace("{{services}}", serviceRows)
    .replace("{{amount}}", invoice.amount)
    .replace("{{gst}}", invoice.total - invoice.amount)
    .replace("{{total}}", invoice.total)
    .replace(
      "LOGO_URL",
      "http://localhost:5000/public/logo.png"
    );

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfPath = path.join(
    __dirname,
    "../../invoices",
    `${invoice.invoiceNo}.pdf`
  );

  await page.pdf({
    path: pdfPath,
    format: "A4",
    printBackground: true,
  });

  await browser.close();
};
