// Simple Express backend for the portfolio contact form.
// Receives a message from the frontend and emails it to you via Nodemailer.
// Falls back to just logging the message if email isn't configured yet,
// so the form still works out of the box during local development.

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Very small in-memory rate limiter: max 5 messages per IP per 10 minutes
const rateLimitWindowMs = 10 * 60 * 1000;
const rateLimitMax = 5;
const hits = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const entry = hits.get(ip) || [];
  const recent = entry.filter(t => now - t < rateLimitWindowMs);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > rateLimitMax;
}

// Build a mail transporter only if SMTP credentials are present in .env
let transporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", emailConfigured: Boolean(transporter) });
});

app.post("/api/contact", async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: "Too many messages sent recently. Please try again later." });
  }

  const { name, email, subject, message } = req.body || {};

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields (name, email, subject, message) are required." });
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return res.status(400).json({ error: "Please provide a valid email address." });
  }

  const submission = {
    name: String(name).slice(0, 200),
    email: String(email).slice(0, 200),
    subject: String(subject).slice(0, 300),
    message: String(message).slice(0, 5000),
    receivedAt: new Date().toISOString()
  };

  // Always log it, so nothing is lost even if email sending fails or isn't configured
  console.log("New portfolio contact message:", submission);

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"Portfolio Contact Form" <${process.env.SMTP_USER}>`,
        to: process.env.CONTACT_TO_EMAIL || "kmtarang7311@gmail.com",
        replyTo: submission.email,
        subject: `[Portfolio] ${submission.subject}`,
        text: `From: ${submission.name} <${submission.email}>\n\n${submission.message}`
      });
    } catch (err) {
      console.error("Email send failed:", err.message);
      // Still return success to the visitor since the message was logged;
      // you'll see it in the server logs even if email delivery failed.
    }
  }

  res.json({ status: "received" });
});

app.listen(PORT, () => {
  console.log(`Portfolio backend running on http://localhost:${PORT}`);
  console.log(transporter
    ? "SMTP is configured — messages will be emailed to you."
    : "SMTP is NOT configured — messages will only be logged to this console. See backend/.env.example."
  );
});
