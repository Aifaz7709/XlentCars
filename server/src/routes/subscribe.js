// e.g. server/src/routes/subscribe.js
const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

router.post("/subscribe", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: '"XLentCar Website" <no-reply@xlentcar.com>',
      to: "info@xlentcar.com",
      subject: "New newsletter subscriber",
      text: `New subscriber email: ${email}`,
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

module.exports = router;