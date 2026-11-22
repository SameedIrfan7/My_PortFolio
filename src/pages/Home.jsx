import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState, useMemo } from "react";
import { Points, PointMaterial } from "@react-three/drei";
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
  "End-to-end products · Frontend to backend",
  "AI/ML · LLM integration · Data systems",
  "Claude Certified Architect · Anthropic",
  "Enterprise automation: 90-minute checks to under 30 seconds",
];

// ─── Main Home Component ──────────────────────────────────────────────────────
const Home = () => {
  const audioRef = useRef(new Audio(sakura));
  audioRef.current.volume = 0.4;
  audioRef.current.loop = true;

  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [liveTime, setLiveTime] = useState("");
  const [isCompactLayout, setIsCompactLayout] = useState(() =>
    window.matchMedia("(max-width: 1279px)").matches
  );
  const [isMobileViewport, setIsMobileViewport] = useState(() =>
    window.matchMedia("(max-width: 767px)").matches
  );

  useEffect(() => {
    const compactQuery = window.matchMedia("(max-width: 1279px)");
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const updateLayout = () => {
      setIsCompactLayout(compactQuery.matches);
      setIsMobileViewport(mobileQuery.matches);
    };

    updateLayout();
    compactQuery.addEventListener("change", updateLayout);
    mobileQuery.addEventListener("change", updateLayout);
    return () => {
      compactQuery.removeEventListener("change", updateLayout);
      mobileQuery.removeEventListener("change", updateLayout);
    };
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
              position={[-6, isMobileViewport ? 2.8 : 2.6, -1]}
              scale={isMobileViewport ? [0.00065, 0.00065, 0.00065] : [0.002, 0.002, 0.002]}
              speed={1.2}
              minX={-6}
              maxX={6}
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
      <div className="relative z-10 flex min-h-screen items-center px-6 py-20 xl:absolute xl:inset-0 xl:px-16 xl:py-0 2xl:px-24">
        <div className="w-full max-w-7xl mx-auto flex flex-col xl:flex-row items-center justify-between gap-6 xl:gap-10">

          {/* ── LEFT SIDE — Unanim.studio Swiss Grid & Dynamic Typography ── */}
          <div className="flex-1 flex flex-col gap-4 md:gap-5 max-w-2xl relative">
            {/* Unanim.studio Architectural Grid Crosshairs & Live Telemetry Strip */}
            <div className="flex flex-wrap items-center gap-3 pb-3 border-b border-white/[0.08] text-[11px] font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E10600] animate-ping" />
                <span className="text-white font-medium tracking-wider">
                  BLR, IN [{liveTime || "21:15:00"} IST]
                </span>
                <span className="text-zinc-600">·</span>
                <span className="text-zinc-400 hidden sm:inline">12°58'N 77°35'E</span>
              </div>
            </div>

            {/* Signal Red Role Line */}
            <span
              className="flex items-center gap-2 pt-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#E10600] sm:text-xs xl:tracking-[0.22em]"
            >
              Full-Stack Software Engineer
            </span>

            {/* Name types once and stays visible. */}
            <div className="leading-none select-none min-h-[140px] xl:min-h-[190px] flex flex-col justify-center">
              <div className="flex items-center">
                <h1 className="text-6xl sm:text-7xl xl:text-9xl font-black text-white block" style={{ lineHeight: 0.95, letterSpacing: "-0.02em" }}>
                  {line1 || "\u00A0"}
                </h1>
                {nameText.length <= 6 && (
                  <span className="hero-name-caret" aria-hidden="true" />
                )}
              </div>
              <div className="flex items-center">
                <h1 className="text-6xl sm:text-7xl xl:text-9xl font-black block bg-gradient-to-r from-white via-[#C0C0C0] to-[#E10600] bg-clip-text text-transparent" style={{ lineHeight: 0.95, letterSpacing: "-0.02em" }}>
                  {line2 || (nameText.length <= 6 ? "" : "\u00A0")}
                </h1>
                {nameText.length > 6 && nameText.length < FULL_NAME.length && (
                  <span className="hero-name-caret" aria-hidden="true" />
                )}
              </div>
            </div>

            <div className="flex w-full justify-center xl:hidden">
              {isCompactLayout && <PixelPortrait compact />}
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

          </div>

          {/* ── RIGHT SIDE — Pixel Portrait Assembly Animation ── */}
          <div className="hidden xl:flex flex-shrink-0 items-center justify-center">
            {!isCompactLayout && <PixelPortrait />}
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
