import React, { useState, useEffect } from "react";
import cognizantLogo from "../assets/images/cognizant_horizontal_white.png";
import claudeLogo from "../assets/icons/claude.svg";
import nakkhiworksLogo from "../assets/images/nakkhiworks_logo.png";

import sameedImg from "../assets/images/personal/sameed_2.jpg";

// ─── Mini Sparkline (upward trend) ────────────────────────────────────────────
function Sparkline({ color = "#22c55e" }) {
  return (
    <svg viewBox="0 0 80 24" className="w-full h-6" fill="none">
      <defs>
        <linearGradient id={`sg-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path
        d="M0,22 Q10,18 20,16 T40,10 T60,6 T80,2"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}
      />
      <path
        d="M0,22 Q10,18 20,16 T40,10 T60,6 T80,2 L80,24 L0,24 Z"
        fill={`url(#sg-${color})`}
      />
      <circle cx="80" cy="2" r="3" fill={color} />
    </svg>
  );
}

// ─── Mini Bar Chart ────────────────────────────────────────────────────────────
function MiniBarChart() {
  const bars = [30, 55, 40, 70, 60, 85, 75, 90, 80, 95];
  return (
    <div className="flex items-end gap-0.5 h-7 w-full">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm"
          style={{
            height: `${h}%`,
            background: i % 3 === 1 ? "#E10600" : "#22c55e",
            opacity: 0.8,
          }}
        />
      ))}
    </div>
  );
}

// ─── Audio Bars ────────────────────────────────────────────────────────────────
function AudioBars() {
  const heights = [40, 65, 45, 85, 60, 100, 75, 50, 90, 70, 55, 80];
  return (
    <div className="flex items-center gap-0.5 h-5 w-full">
      {heights.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-full animate-pulse"
          style={{
            height: `${h}%`,
            background: `linear-gradient(to top, #E10600, #C0C0C0)`,
            animationDelay: `${(i * 0.08).toFixed(2)}s`,
            animationDuration: `${0.8 + (i % 3) * 0.3}s`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Main Autopilot Hero Visual ────────────────────────────────────────────────
export default function AutopilotHeroVisual() {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  useEffect(() => {
    const onMove = (e) => {
      setMouseX((e.clientX / window.innerWidth) * 2 - 1);
      setMouseY((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const tX = -mouseY * 5;
  const tY = mouseX * 6;

  return (
    <div className="relative select-none" style={{ width: "460px", height: "580px" }}>

      {/* ── Background atmospheric glow ── */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 55%, rgba(225,6,0,0.15) 0%, rgba(192,192,192,0.05) 55%, transparent 80%)",
          filter: "blur(50px)",
        }}
      />

      {/* ── Portrait (centered, with bottom-fade dissolve) ── */}
      <div
        className="absolute inset-0 flex items-end justify-center transition-transform duration-200 ease-out"
        style={{
          transform: `rotateX(${tX}deg) rotateY(${tY}deg)`,
          transformStyle: "preserve-3d",
          perspective: "1000px",
        }}
      >
        {/* Rim light glow behind figure */}
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: "5%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "280px",
            height: "400px",
            background: "radial-gradient(ellipse at 50% 60%, rgba(225,6,0,0.22) 0%, rgba(192,192,192,0.08) 50%, transparent 75%)",
            filter: "blur(30px)",
          }}
        />

        {/* Portrait image with CSS bottom-fade (simulates cut-out look) */}
        <img
          src={sameedImg}
          alt="Sameed Irfan"
          className="relative block object-cover"
          style={{
            height: "520px",
            width: "auto",
            maxWidth: "340px",
            objectPosition: "center top",
            maskImage: "linear-gradient(to bottom, black 55%, rgba(0,0,0,0.6) 80%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 55%, rgba(0,0,0,0.6) 80%, transparent 100%)",
            filter: "contrast(1.08) brightness(0.92)",
          }}
        />

        {/* Subtle red & silver rim lights on the sides */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 8% 50%, rgba(225,6,0,0.18) 0%, transparent 38%), radial-gradient(ellipse at 92% 50%, rgba(192,192,192,0.12) 0%, transparent 38%)",
          }}
        />
      </div>

      {/* ══════════════════════════════════════════════════════
          FLOATING CARDS — positioned relative to container
          (not relative to portrait so they never overlap face)
          ══════════════════════════════════════════════════════ */}

      {/* ── Card 1: TOP-LEFT — Cognizant Ops ── */}
      <div
        className="absolute z-20 p-3 rounded-2xl animate-float"
        style={{
          top: "30px",
          left: "-10px",
          width: "192px",
          background: "rgba(14,14,16,0.88)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.6), 0 0 20px rgba(225,6,0,0.12)",
          transform: `perspective(600px) rotateY(14deg) rotateX(4deg) translateZ(40px) rotateX(${tX * 0.3}deg) rotateY(${tY * 0.3}deg)`,
          animationDelay: "0s",
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <img src={cognizantLogo} alt="Cognizant" className="h-3.5 w-auto object-contain" />
          <span className="flex items-center gap-1 text-[9px] font-mono text-[#22c55e] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-ping" />
            LIVE
          </span>
        </div>
        <MiniBarChart />
        <div className="flex justify-between mt-1.5 text-[9px] font-mono">
          <span className="text-[#909090]">Application Ops</span>
          <span className="text-[#E10600] font-bold">&lt;30s</span>
        </div>
      </div>

      {/* ── Card 2: TOP-RIGHT — Nakkhiworks ── */}
      <div
        className="absolute z-20 p-3 rounded-2xl animate-float-reverse"
        style={{
          top: "20px",
          right: "-5px",
          width: "178px",
          background: "rgba(14,14,16,0.88)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
          transform: `perspective(600px) rotateY(-14deg) rotateX(4deg) translateZ(35px) rotateX(${tX * 0.3}deg) rotateY(${tY * 0.3}deg)`,
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded overflow-hidden bg-white/10">
              <img src={nakkhiworksLogo} alt="Nakkhiworks" className="w-full h-full object-cover" />
            </div>
            <span className="text-[9px] font-space text-white font-semibold">Nakkhiworks</span>
          </div>
          <span className="flex items-center gap-1 text-[9px] font-mono text-[#22c55e] font-bold">
            <span className="w-1 h-1 rounded-full bg-[#22c55e]" />
            LIVE
          </span>
        </div>
        <Sparkline color="#22c55e" />
        <div className="text-[8px] font-mono text-[#606060] mt-1 truncate">
          nakkhiworks.d4vnci.tech
        </div>
      </div>

      {/* ── Card 3: CENTER-RIGHT — Claude Certified (the hero card) ── */}
      <div
        className="absolute z-30 p-3.5 rounded-2xl animate-float-slow"
        style={{
          bottom: "160px",
          right: "-20px",
          width: "220px",
          background: "rgba(16,13,12,0.92)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(217,119,87,0.4)",
          boxShadow: "0 16px 48px rgba(0,0,0,0.8), 0 0 28px rgba(217,119,87,0.22)",
          transform: `perspective(600px) rotateY(-10deg) rotateX(2deg) translateZ(60px) rotateX(${tX * 0.3}deg) rotateY(${tY * 0.3}deg)`,
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#D97757]/20 border border-[#D97757]/50 flex items-center justify-center p-0.5">
              <img src={claudeLogo} alt="Claude" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="text-[10px] font-space font-semibold text-white leading-tight">Claude Architect</div>
              <div className="text-[8px] font-mono text-[#D97757]">Anthropic Certified</div>
            </div>
          </div>
          <span className="text-[9px] font-mono text-[#22c55e] bg-[#22c55e]/10 border border-[#22c55e]/30 px-1.5 py-0.5 rounded-full font-bold">
            +99.4%
          </span>
        </div>
        <div className="text-xl font-space font-bold text-white mb-1">
          1.2M <span className="text-xs font-mono font-normal text-[#909090]">Tokens/sec</span>
        </div>
        <Sparkline color="#22c55e" />
        <div className="flex justify-between text-[8px] font-mono text-[#606060] mt-1">
          <span>LLM Routing & AI APIs</span>
          <span className="text-white">Production</span>
        </div>
      </div>

      {/* ── Card 4: BOTTOM-LEFT — NurQuran PWA ── */}
      <div
        className="absolute z-20 p-3 rounded-2xl animate-float"
        style={{
          bottom: "90px",
          left: "-10px",
          width: "172px",
          background: "rgba(14,14,16,0.88)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
          transform: `perspective(600px) rotateY(14deg) rotateX(-4deg) translateZ(35px) rotateX(${tX * 0.3}deg) rotateY(${tY * 0.3}deg)`,
          animationDelay: "1.5s",
        }}
      >
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#E10600]" />
            <span className="text-[9px] font-space font-semibold text-white">NurQuran PWA</span>
          </div>
          <span className="text-[8px] font-mono text-[#909090]">114 Surahs</span>
        </div>
        <AudioBars />
        <div className="flex justify-between text-[8px] font-mono text-[#606060] mt-1.5">
          <span>Cloud Sync</span>
          <span className="text-[#22c55e]">Supabase</span>
        </div>
      </div>

      {/* ── Card 5: BOTTOM-CENTER — ReconFlow mini chip ── */}
      <div
        className="absolute z-10 px-3 py-2 rounded-xl"
        style={{
          bottom: "35px",
          left: "50%",
          transform: `translateX(-50%) perspective(600px) rotateX(-5deg) rotateX(${tX * 0.2}deg) rotateY(${tY * 0.2}deg)`,
          background: "rgba(14,14,16,0.82)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          whiteSpace: "nowrap",
        }}
      >
        <div className="flex items-center gap-2 text-[9px] font-mono">
          <span className="text-[#22c55e] font-bold">PySpark</span>
          <span className="text-[#404040]">·</span>
          <span className="text-white font-semibold">1M+ Records</span>
          <span className="text-[#404040]">·</span>
          <span className="text-[#C0C0C0]">Zero Discrepancy</span>
        </div>
      </div>

      {/* ── Ticker strip (top) ── */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center gap-3 text-[9px] font-mono tracking-widest uppercase whitespace-nowrap"
        style={{ color: "#505050" }}
      >
        {["COGNIZANT", "ANTHROPIC", "NAKKHIWORKS", "PYSPARK", "REACT", "NEXT.JS"].map((item, i) => (
          <React.Fragment key={item}>
            <span className="hover:text-white transition-colors cursor-default">{item}</span>
            {i < 5 && <span style={{ color: "#E10600" }}>·</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
