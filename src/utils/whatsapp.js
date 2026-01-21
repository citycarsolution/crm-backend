const twilio = require("twilio");

/**
 * Send invoice via WhatsApp (PDF link)
 */
const sendInvoiceWhatsApp = async (invoice) => {
  try {
    const client = twilio(
      process.env.TWILIO_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const pdfLink = `${process.env.BACKEND_URL}${invoice.pdfUrl}`;

    await client.messages.create({
      from: "whatsapp:+14155238886", // Twilio sandbox number
      to: `whatsapp:+91${invoice.phone}`,
      body: `
Hello ${invoice.client} 👋

Your invoice ${invoice.invoiceNo} has been generated.

💰 Total: ₹${invoice.total}

📄 Download Invoice:
${pdfLink}

Thank you,
3Arrow Digital Services
      `,
    });

    console.log("✅ WhatsApp invoice sent:", invoice.phone);
  } catch (err) {
    console.error("❌ WhatsApp Error:", err.message);
  }
};

module.exports = sendInvoiceWhatsApp;
