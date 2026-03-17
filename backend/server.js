const express = require("express");
const cors = require("cors");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const requiredEnv = ["BREVO_API_KEY", "BREVO_SENDER_EMAIL", "TO_EMAIL"];
const getMissingEnv = () => requiredEnv.filter((key) => !process.env[key]);

// Log missing API configuration at startup (helps Render debugging)
const missingEnvAtStartup = getMissingEnv();
if (missingEnvAtStartup.length > 0) {
  console.error("Missing email config keys at startup:", missingEnvAtStartup);
}

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
  console.log("Contact request received");
  const requestHasAllFields = Boolean(name && email && message);
  if (!requestHasAllFields) {
    console.error("Contact request missing fields", {
      hasName: Boolean(name),
      hasEmail: Boolean(email),
      hasMessage: Boolean(message),
    });
  }

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

  if (typeof fetch !== "function") {
    console.error("Fetch API not available in this Node runtime.");
    return res.status(500).json({
      success: false,
      message: "Erreur lors de l'envoi. Réessayez plus tard.",
    });
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

  const senderName = process.env.BREVO_SENDER_NAME || "Davson Portfolio";

  const payload = {
    sender: {
      name: senderName,
      email: process.env.BREVO_SENDER_EMAIL,
    },
    to: [{ email: process.env.TO_EMAIL }],
    replyTo: { email },
    subject: `Nouveau message portfolio - ${name}`,
    textContent: `Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    htmlContent: `
      <h2>Nouveau message depuis le portfolio</h2>
      <p><strong>Nom :</strong> ${safeName}</p>
      <p><strong>Email :</strong> ${safeEmail}</p>
      <p><strong>Message :</strong><br />${safeMessage}</p>
    `,
  };

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const detail = data && data.message ? data.message : response.status;
      throw new Error(`Brevo API error: ${detail}`);
    }

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
