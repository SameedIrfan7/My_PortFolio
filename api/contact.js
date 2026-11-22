const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";
const TURNSTILE_ENDPOINT = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

function respond(res, status, body) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json");
  return res.status(status).json(body);
}

function normalizeHost(value) {
  try {
    return new URL(value.includes("://") ? value : `https://${value}`).host.toLowerCase();
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return respond(res, 405, { error: "Method not allowed." });
  }

  const allowedHosts = [
    ...(process.env.CONTACT_ALLOWED_ORIGINS || "").split(","),
    process.env.VERCEL_URL || "",
  ]
    .map((host) => normalizeHost(host.trim()))
    .filter(Boolean);

  if (!allowedHosts.length) {
    return respond(res, 503, { error: "Contact form is not configured." });
  }

  const origin = req.headers.origin;
  if (origin && !allowedHosts.includes(normalizeHost(origin))) {
    return respond(res, 403, { error: "This origin is not allowed." });
  }

  const { name, email, message, turnstileToken, website } = req.body || {};
  if (
    typeof name !== "string" ||
    !name.trim() ||
    name.length > 100 ||
    typeof email !== "string" ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    typeof message !== "string" ||
    !message.trim() ||
    message.length > 5000 ||
    typeof turnstileToken !== "string" ||
    !turnstileToken ||
    (typeof website === "string" && website.trim())
  ) {
    return respond(res, 400, { error: "Please check the form and verification, then try again." });
  }

  const {
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    EMAILJS_PUBLIC_KEY,
    EMAILJS_PRIVATE_KEY,
    TURNSTILE_SECRET_KEY,
  } = process.env;

  if (
    !EMAILJS_SERVICE_ID ||
    !EMAILJS_TEMPLATE_ID ||
    !EMAILJS_PUBLIC_KEY ||
    !EMAILJS_PRIVATE_KEY ||
    !TURNSTILE_SECRET_KEY
  ) {
    return respond(res, 503, { error: "Contact form is not configured." });
  }

  try {
    const verificationResponse = await fetch(TURNSTILE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: TURNSTILE_SECRET_KEY,
        response: turnstileToken,
      }),
    });

    if (!verificationResponse.ok) {
      return respond(res, 502, { error: "Message verification is temporarily unavailable." });
    }

    const verification = await verificationResponse.json();
    const allowedHostnames = new Set(
      allowedHosts.map((host) => new URL(`https://${host}`).hostname)
    );
    if (!verification.success || !allowedHostnames.has(verification.hostname)) {
      return respond(res, 403, { error: "Message verification failed. Please try again." });
    }

    const emailResponse = await fetch(EMAILJS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        accessToken: EMAILJS_PRIVATE_KEY,
        template_params: {
          from_name: name.trim(),
          to_name: "Sameed Irfan",
          from_email: email.trim(),
          to_email: "sameedirfan7@gmail.com",
          message: message.trim(),
        },
      }),
    });

    if (!emailResponse.ok) {
      return respond(res, 502, { error: "Your message could not be delivered. Please try again." });
    }

    return respond(res, 200, { success: true });
  } catch (error) {
    console.error("Contact form provider request failed:", error);
    return respond(res, 502, { error: "Your message could not be delivered. Please try again." });
  }
}
