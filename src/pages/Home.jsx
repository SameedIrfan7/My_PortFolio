import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState, useMemo } from "react";
import { Points, PointMaterial } from "@react-three/drei";
import { Link } from "react-router-dom";
import sakura from "../assets/sakura.mp3";
import { soundoff, soundon } from "../assets/icons";
import { Bird } from "../models";
import PixelPortrait from "../components/PixelPortrait";

const FULL_NAME = "SAMEED IRFAN";

// ─── Star Field Component (Moonlit Silver on Charcoal) ────────────────────────
function StarField(props) {
  const ref = useRef();

  const sphere = useMemo(() => {
    const positions = new Float32Array(2200 * 3);
    for (let i = 0; i < 2200; i++) {
      const r = 6.0;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 16;
      ref.current.rotation.y -= delta / 22;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#C0C0C0"
          size={0.012}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.75}
        />
      </Points>
    </group>
  );
}

// ─── Typewriter Phrases for Subtitle ─────────────────────────────────────────
const PHRASES = [
  "Application Ops Engineer @ Cognizant",
  "Claude Certified Architect · Anthropic",
  "Enterprise Automation: Cut 90-min checks to <30 seconds",
  "Full-Stack & AI: Python · PySpark · React · Node · LLM APIs",
];

// ─── GitHub Icon ─────────────────────────────────────────────────────────────
function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

// ─── LinkedIn Icon ────────────────────────────────────────────────────────────
function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

// ─── Main Home Component ──────────────────────────────────────────────────────
const Home = () => {
  const audioRef = useRef(new Audio(sakura));
  audioRef.current.volume = 0.4;
  audioRef.current.loop = true;

  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [liveTime, setLiveTime] = useState("");
  const [isMobileLayout, setIsMobileLayout] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateLayout = () => setIsMobileLayout(mediaQuery.matches);

    updateLayout();
    mediaQuery.addEventListener("change", updateLayout);
    return () => mediaQuery.removeEventListener("change", updateLayout);
  }, []);

  // Live real-time clock for Unanim.studio Swiss telemetry
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveTime(
        now.toLocaleTimeString("en-US", {
          timeZone: "Asia/Kolkata",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // ── Name Typewriter with Font Cycling ──
  const [nameText, setNameText] = useState("");

  // Music playback
  useEffect(() => {
    if (isPlayingMusic) {
      audioRef.current.play();
    }
    return () => {
      audioRef.current.pause();
    };
  }, [isPlayingMusic]);

  // Subtitle phrase cycling with fade
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setPhraseIndex((prev) => (prev + 1) % PHRASES.length);
        setFade(true);
      }, 400);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  // Type the name once, then leave it fully visible.
  useEffect(() => {
    if (nameText.length >= FULL_NAME.length) return undefined;

    const timeout = setTimeout(() => {
      setNameText(FULL_NAME.slice(0, nameText.length + 1));
    }, 90);

    return () => clearTimeout(timeout);
  }, [nameText]);

  // Split name text between Line 1 ("SAMEED") and Line 2 ("IRFAN")
  const line1 = nameText.slice(0, 6);
  const line2 = nameText.length > 6 ? nameText.slice(7) : "";

  return (
    <section id="home" className="w-full min-h-screen relative overflow-hidden" style={{ background: "#181818" }}>
      {/* ── Three.js Canvas with StarField & Flying Phoenix Bird ── */}
      {/* Bird Canvas constrained to left 55% so it doesn't intrude on photo panel */}
      <div className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
        <Canvas
          className="w-full h-full"
          camera={{ position: [0, 0, 5], fov: 60, near: 0.1, far: 1000 }}
          style={{ background: "#181818" }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={1.5} />
            <directionalLight position={[1, 3, 2]} intensity={2.2} />
            <pointLight position={[-6, 6, 2]} intensity={2} color="#E10600" />
            <pointLight position={[6, -4, 2]} intensity={1.5} color="#C0C0C0" />
            <hemisphereLight skyColor="#C0C0C0" groundColor="#181818" intensity={0.6} />
            <StarField />
            <Bird
              position={[-7, 2.2, -1]}
              scale={[0.0032, 0.0032, 0.0032]}
              speed={0.016}
              minX={-10}
              maxX={-1.5}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* ── Charcoal & Signal Red radial glow background ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 15% 50%, rgba(225,6,0,0.06) 0%, transparent 60%), radial-gradient(ellipse at 85% 50%, rgba(192,192,192,0.04) 0%, transparent 60%)",
        }}
      />

      {/* ── Hero Content Overlay ── */}
      <div className="relative z-10 flex min-h-screen items-center px-6 py-20 md:absolute md:inset-0 md:px-16 md:py-0 lg:px-24">
        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">

          {/* ── LEFT SIDE — Unanim.studio Swiss Grid & Dynamic Typography ── */}
          <div className="flex-1 flex flex-col gap-4 md:gap-5 max-w-2xl relative">
            {/* Unanim.studio Architectural Grid Crosshairs & Live Telemetry Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.08] text-[11px] font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E10600] animate-ping" />
                <span className="text-white font-medium tracking-wider">
                  BLR, IN [{liveTime || "21:15:00"} IST]
                </span>
                <span className="text-zinc-600">·</span>
                <span className="text-zinc-400 hidden sm:inline">12°58'N 77°35'E</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-emerald-400 font-semibold tracking-wider uppercase text-[10px]">
                  AVAILABLE FOR ROLES
                </span>
              </div>
            </div>

            {/* Signal Red Role Line */}
            <span
              className="flex items-center gap-2 pt-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#E10600] sm:text-xs md:tracking-[0.22em]"
            >
              <span className="md:hidden">Application Ops Engineer</span>
              <span className="hidden md:inline">
                Application Ops Engineer · Enterprise Data &amp; AI
              </span>
            </span>

            {/* Name types once and stays visible. */}
            <div className="leading-none select-none min-h-[140px] md:min-h-[190px] flex flex-col justify-center">
              <div className="flex items-center">
                <h1 className="text-6xl sm:text-7xl md:text-9xl font-black text-white block" style={{ lineHeight: 0.95, letterSpacing: "-0.02em" }}>
                  {line1 || "\u00A0"}
                </h1>
                {nameText.length <= 6 && (
                  <span className="hero-name-caret" aria-hidden="true" />
                )}
              </div>
              <div className="flex items-center">
                <h1 className="text-6xl sm:text-7xl md:text-9xl font-black block bg-gradient-to-r from-white via-[#C0C0C0] to-[#E10600] bg-clip-text text-transparent" style={{ lineHeight: 0.95, letterSpacing: "-0.02em" }}>
                  {line2 || (nameText.length <= 6 ? "" : "\u00A0")}
                </h1>
                {nameText.length > 6 && nameText.length < FULL_NAME.length && (
                  <span className="hero-name-caret" aria-hidden="true" />
                )}
              </div>
            </div>

            <div className="flex w-full justify-center md:hidden">
              {isMobileLayout && <PixelPortrait compact />}
            </div>

            {/* Subtitle Typewriter */}
            <p
              className="text-base md:text-lg text-[#C0C0C0] min-h-[1.75rem] transition-opacity duration-400 font-inter"
              style={{ opacity: fade ? 1 : 0, transition: "opacity 0.4s ease" }}
            >
              {PHRASES[phraseIndex]}
            </p>

            {/* Autopilot Style Capsule Pill CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="autopilot-btn-primary group"
              >
                <span>Explore My Work</span>
                <span className="autopilot-arrow-pill">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="autopilot-btn group"
              >
                <span>Let&apos;s Connect</span>
                <span className="autopilot-arrow-pill">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H8M17 7V16" />
                  </svg>
                </span>
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex gap-4 mt-1">
              <a
                href="https://github.com/SameedIrfan7"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C0C0C0] hover:text-[#E10600] transition-colors duration-300"
                aria-label="GitHub"
              >
                <GitHubIcon />
              </a>
              <a
                href="https://www.linkedin.com/in/sameed-irfan-7b767622b/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C0C0C0] hover:text-[#E10600] transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </a>
            </div>
          </div>

          {/* ── RIGHT SIDE — Pixel Portrait Assembly Animation ── */}
          <div className="hidden md:flex flex-shrink-0 items-center justify-center">
            {!isMobileLayout && <PixelPortrait />}
          </div>
        </div>
      </div>

      {/* ── Music Toggle — bottom left, charcoal glass style ── */}
      <div className="absolute bottom-6 left-6 z-20">
        <button
          onClick={() => setIsPlayingMusic(!isPlayingMusic)}
          className="flex items-center justify-center w-11 h-11 rounded-full cursor-pointer transition-all duration-300 hover:scale-110"
          style={{
            background: "rgba(37, 37, 37, 0.85)",
            border: "1px solid rgba(225, 6, 0, 0.35)",
            backdropFilter: "blur(12px)",
            boxShadow: isPlayingMusic
              ? "0 0 16px rgba(225, 6, 0, 0.5)"
              : "none",
          }}
          aria-label={isPlayingMusic ? "Pause music" : "Play music"}
        >
          <img
            src={!isPlayingMusic ? soundoff : soundon}
            alt={isPlayingMusic ? "sound on" : "sound off"}
            className="w-5 h-5 object-contain"
            style={{ filter: isPlayingMusic ? "invert(14%) sepia(97%) saturate(7469%) hue-rotate(3deg) brightness(97%) contrast(117%)" : "invert(80%)" }}
          />
        </button>
      </div>

      {/* ── Scroll Indicator — bottom center in Signal Red & Moonlit Silver ── */}
      <a
        href="#about"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
        }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 cursor-pointer group"
        aria-label="Scroll to About section"
      >
        <span className="text-xs text-[#C0C0C0] group-hover:text-white tracking-widest uppercase font-mono transition-colors">scroll</span>
        <div
          className="w-px h-10 mx-auto"
          style={{
            background: "linear-gradient(to bottom, #E10600, transparent)",
            animation: "scrollPulse 2s ease-in-out infinite",
          }}
        />
        <svg
          className="w-4 h-4 text-[#C0C0C0] group-hover:text-[#E10600] transition-colors"
          style={{ animation: "bounce 2s infinite" }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </a>

      {/* ── Keyframe styles ── */}
      <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
      `}</style>
    </section>
  );
};

export default Home;
