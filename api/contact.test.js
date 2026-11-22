import assert from "node:assert/strict";
import { test } from "node:test";

import handler from "./contact.js";

function createResponse() {
  return {
    headers: {},
    setHeader(name, value) {
      this.headers[name] = value;
    },
    status(statusCode) {
      this.statusCode = statusCode;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

function createRequest(overrides = {}) {
  return {
    method: "POST",
    headers: { origin: "https://portfolio.d4vnci.tech" },
    body: {
      name: "Test Sender",
      email: "sender@example.com",
      message: "A test message",
      turnstileToken: "valid-token",
      website: "",
    },
    ...overrides,
  };
}

test("rejects methods other than POST", async () => {
  const response = createResponse();
  await handler(createRequest({ method: "GET" }), response);
  assert.equal(response.statusCode, 405);
});

test("rejects invalid form data before contacting providers", async (t) => {
  const allowedOrigins = process.env.CONTACT_ALLOWED_ORIGINS;
  process.env.CONTACT_ALLOWED_ORIGINS = "portfolio.d4vnci.tech";
  t.after(() => {
    if (allowedOrigins === undefined) delete process.env.CONTACT_ALLOWED_ORIGINS;
    else process.env.CONTACT_ALLOWED_ORIGINS = allowedOrigins;
  });

  const response = createResponse();
  await handler(createRequest({ body: { name: "", email: "invalid" } }), response);
  assert.equal(response.statusCode, 400);
});

test("validates Turnstile before sending through EmailJS", async (t) => {
  const env = {
    CONTACT_ALLOWED_ORIGINS: process.env.CONTACT_ALLOWED_ORIGINS,
    EMAILJS_SERVICE_ID: process.env.EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID: process.env.EMAILJS_TEMPLATE_ID,
    EMAILJS_PUBLIC_KEY: process.env.EMAILJS_PUBLIC_KEY,
    EMAILJS_PRIVATE_KEY: process.env.EMAILJS_PRIVATE_KEY,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
  };
  Object.assign(process.env, {
    CONTACT_ALLOWED_ORIGINS: "portfolio.d4vnci.tech",
    EMAILJS_SERVICE_ID: "service-test",
    EMAILJS_TEMPLATE_ID: "template-test",
    EMAILJS_PUBLIC_KEY: "public-test",
    EMAILJS_PRIVATE_KEY: "private-test",
    TURNSTILE_SECRET_KEY: "turnstile-test",
  });
  t.after(() => {
    for (const [key, value] of Object.entries(env)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });

  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    if (url === "https://challenges.cloudflare.com/turnstile/v0/siteverify") {
      return new Response(
        JSON.stringify({ success: true, hostname: "portfolio.d4vnci.tech" }),
        { status: 200 }
      );
    }
    return new Response("", { status: 200 });
  };
  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  const response = createResponse();
  await handler(createRequest(), response);

  assert.equal(response.statusCode, 200);
  assert.equal(calls.length, 2);
  assert.equal(calls[0].url, "https://challenges.cloudflare.com/turnstile/v0/siteverify");
  assert.equal(calls[1].url, "https://api.emailjs.com/api/v1.0/email/send");
  const emailRequest = JSON.parse(calls[1].options.body);
  assert.equal(emailRequest.accessToken, "private-test");
  assert.equal(emailRequest.template_params.from_email, "sender@example.com");
});
