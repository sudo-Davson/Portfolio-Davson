const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const requiredEnv = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "TO_EMAIL",
];

const getMissingEnv = () => requiredEnv.filter((key) => !process.env[key]);

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

app.get("/", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Veuillez remplir tous les champs requis.",
    });
  }

  const missingEnv = getMissingEnv();
  if (missingEnv.length > 0) {
    console.error("Missing email config keys:", missingEnv);
    return res.status(500).json({
      success: false,
      message: "Configuration email manquante côté serveur.",
    });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

  const mailOptions = {
    from: `"Davson Portfolio" <${process.env.SMTP_USER}>`,
    to: process.env.TO_EMAIL,
    replyTo: email,
    subject: `Nouveau message portfolio - ${name}`,
    text: `Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `
      <h2>Nouveau message depuis le portfolio</h2>
      <p><strong>Nom :</strong> ${safeName}</p>
      <p><strong>Email :</strong> ${safeEmail}</p>
      <p><strong>Message :</strong><br />${safeMessage}</p>
    `,
  };

  try {
    await transporter.verify();
    await transporter.sendMail(mailOptions);
    return res.json({
      success: true,
      message: "Message envoyé avec succès.",
    });
  } catch (error) {
    console.error(
      "Email send error:",
      error && error.message ? error.message : error
    );
    return res.status(500).json({
      success: false,
      message: "Erreur lors de l'envoi. Réessayez plus tard.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Contact API running on port ${PORT}`);
});




