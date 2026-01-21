const nodemailer = require("nodemailer");
const path = require("path");

/**
 * Send invoice email with PDF attachment
 */
const sendInvoiceEmail = async (invoice) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const pdfPath = path.join(
      __dirname,
      "../../public",
      invoice.pdfUrl
    );

    await transporter.sendMail({
      from: `"3Arrow Digital Services" <${process.env.SMTP_USER}>`,
      to: invoice.email,
      subject: `Invoice ${invoice.invoiceNo} from 3Arrow Digital Services`,
      html: `
        <p>Hi <b>${invoice.client}</b>,</p>

        <p>Your invoice <b>${invoice.invoiceNo}</b> has been generated.</p>

        <p><b>Total Amount:</b> ₹${invoice.total}</p>

        <p>Please find the attached invoice PDF.</p>

        <br/>
        <p>Regards,<br/>
        3Arrow Digital Services</p>
      `,
      attachments: [
        {
          filename: `${invoice.invoiceNo}.pdf`,
          path: pdfPath,
        },
      ],
    });

    console.log("✅ Invoice email sent:", invoice.email);
  } catch (err) {
    console.error("❌ Email Error:", err.message);
  }
};

module.exports = sendInvoiceEmail;
