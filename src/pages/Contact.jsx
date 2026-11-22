import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";

import { Fox } from "../models";
import useAlert from "../hooks/useAlert";
import { Alert, Loader } from "../components";

const Contact = () => {
  const turnstileRef = useRef(null);
  const turnstileWidgetId = useRef(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const { alert, showAlert, hideAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState("idle");
  const [turnstileToken, setTurnstileToken] = useState("");
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey || !turnstileRef.current) return undefined;

    let disposed = false;
    let script = document.querySelector(
      'script[src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"]'
    );

    const renderWidget = () => {
      if (disposed || !window.turnstile || !turnstileRef.current) return;
      turnstileWidgetId.current = window.turnstile.render(turnstileRef.current, {
        sitekey: siteKey,
        callback: setTurnstileToken,
        "expired-callback": () => setTurnstileToken(""),
        "error-callback": () => setTurnstileToken(""),
      });
    };

    if (!script) {
      script = document.createElement("script");
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    script.addEventListener("load", renderWidget);
    renderWidget();

    return () => {
      disposed = true;
      script.removeEventListener("load", renderWidget);
      if (turnstileWidgetId.current && window.turnstile) {
        window.turnstile.remove(turnstileWidgetId.current);
        turnstileWidgetId.current = null;
      }
    };
  }, [siteKey]);

  const handleChange = ({ target: { name, value } }) => {
    setForm({ ...form, [name]: value });
  };

  const handleFocus = () => setCurrentAnimation("walk");
  const handleBlur = () => setCurrentAnimation("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!siteKey || !turnstileToken) {
      showAlert({
        show: true,
        text: "Please complete the verification before sending your message.",
        type: "danger",
      });
      return;
    }

    setLoading(true);
    setCurrentAnimation("hit");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          turnstileToken,
          website: e.currentTarget.elements.website.value,
        }),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.error || "I couldn't send your message. Please try again."
        );
      }
      if (!result?.success) {
        throw new Error("I couldn't confirm delivery. Please try again.");
      }

      showAlert({
        show: true,
        text: "Thank you for your message 😃",
        type: "success",
      });
      setTurnstileToken("");
      if (turnstileWidgetId.current && window.turnstile) {
        window.turnstile.reset(turnstileWidgetId.current);
      }

      setTimeout(() => {
        hideAlert(false);
        setForm({ name: "", email: "", message: "" });
      }, 3000);
    } catch (error) {
      console.error("Contact form submission failed:", error);
      showAlert({
        show: true,
        text: error.message || "I didn't receive your message. Please try again.",
        type: "danger",
      });
      setTurnstileToken("");
      if (turnstileWidgetId.current && window.turnstile) {
        window.turnstile.reset(turnstileWidgetId.current);
      }
    } finally {
      setLoading(false);
      setCurrentAnimation("idle");
    }
  };

  return (
    <section id='contact' className='relative flex lg:flex-row flex-col max-container text-[#C0C0C0] pt-20'>
      {alert.show && <Alert {...alert} />}

      <div className='flex-1 min-w-[50%] flex flex-col'>
        <span className="text-xs uppercase tracking-[0.25em] text-[#E10600] font-semibold mb-2 font-mono flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#E10600] animate-ping" />
          Start a Conversation
        </span>
        <h1 className='head-text text-white font-space'>
          Get in{" "}
          <span className="bg-gradient-to-r from-white via-[#C0C0C0] to-[#E10600] bg-clip-text text-transparent font-extrabold">
            Touch
          </span>
        </h1>

        <form
          onSubmit={handleSubmit}
          className='w-full flex flex-col gap-6 mt-10'
        >
          <input
            type="text"
            name="website"
            tabIndex="-1"
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[10000px]"
          />
          <label className='text-[#C0C0C0] font-medium text-sm font-inter'>
            Your Name
            <input
              type='text'
              name='name'
              className='input'
              placeholder='Sameed'
              required
              value={form.name}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </label>
          <label className='text-[#C0C0C0] font-medium text-sm font-inter'>
            Your Email
            <input
              type='email'
              name='email'
              className='input'
              placeholder='sameed@example.com'
              required
              value={form.email}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </label>
          <label className='text-[#C0C0C0] font-medium text-sm font-inter'>
            Your Message
            <textarea
              name='message'
              rows='4'
              className='textarea'
              placeholder='Tell me about your project, idea, or opportunity...'
              required
              value={form.message}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </label>

          <div ref={turnstileRef} />
          {!siteKey && (
            <p className="text-sm text-[#E10600]" role="alert">
              Message verification is not configured yet.
            </p>
          )}

          <button
            type='submit'
            disabled={loading}
            className='btn font-space'
            onFocus={handleFocus}
            onBlur={handleBlur}
          >
            {loading ? "Sending..." : "Submit Message"}
          </button>
        </form>

        {/* Direct Contact Info from Resume */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 pt-8 border-t border-[#333333]">
          <div className="p-4 rounded-xl bg-[#242424] border border-[#383838] hover:border-[#E10600]/60 transition-colors">
            <span className="text-[11px] font-mono text-[#E10600] uppercase tracking-wider block">Direct Email</span>
            <a href="mailto:sameedirfan7@gmail.com" className="text-sm font-semibold text-white hover:text-[#E10600] transition-colors mt-1 block font-mono">
              sameedirfan7@gmail.com
            </a>
          </div>
          <div className="p-4 rounded-xl bg-[#242424] border border-[#383838] hover:border-[#E10600]/60 transition-colors">
            <span className="text-[11px] font-mono text-[#C0C0C0] uppercase tracking-wider block">Location &amp; Phone</span>
            <span className="text-sm font-semibold text-white block mt-1 font-mono">
              Bengaluru, India · +91 911-044-3938
            </span>
          </div>
        </div>
      </div>

      <div className='lg:w-1/2 w-full lg:h-auto md:h-[550px] h-[350px]'>
        <Canvas
          camera={{
            position: [0, 0, 5],
            fov: 75,
            near: 0.1,
            far: 1000,
          }}
        >
          <directionalLight position={[0, 0, 1]} intensity={2.5} />
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 10, 0]} intensity={2} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={2}
          />

          <Suspense fallback={<Loader />}>
            <Fox
              currentAnimation={currentAnimation}
              position={[0.5, 0.35, 0]}
              rotation={[12.629, -0.6, 0]}
              scale={[0.5, 0.5, 0.5]}
            />
          </Suspense>
        </Canvas>
      </div>
    </section>
  );
};

export default Contact;
