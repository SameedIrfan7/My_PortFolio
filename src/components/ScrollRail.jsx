/**
 * ScrollRail.jsx
 * --------------
 * Inspired by yoyu.design:
 * - Pixel & dot-matrix vertical scroll progress rail on the right side
 * - Discrete pixel blocks [■] that highlight as the user scrolls
 * - Live scroll progress percentage readout
 * - Clickable jump-to-section navigation with smooth glide
 */

import { useState, useEffect } from "react";

const SECTIONS = [
  { id: "home", label: "01", name: "HERO" },
  { id: "about", label: "02", name: "ABOUT" },
  { id: "projects", label: "03", name: "PROJECTS" },
  { id: "contact", label: "04", name: "CONTACT" },
];

export default function ScrollRail() {
  const [activeSection, setActiveSection] = useState("home");
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate overall scroll percentage
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? Math.round((window.scrollY / totalHeight) * 100) : 0;
      setScrollPercent(Math.min(100, Math.max(0, progress)));

      // Detect active section
      const scrollPos = window.scrollY + 250;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(SECTIONS[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <aside
      className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-4 select-none pointer-events-auto"
      aria-label="Section Navigation Rail"
    >
      {/* Top: Yoyu-style pixel percentage meter */}
      <div className="flex flex-col items-center text-[10px] font-mono text-zinc-500 mb-1">
        <span className="text-[#E10600] font-bold">{scrollPercent}%</span>
        <span className="text-[8px] tracking-widest text-zinc-600">SCROLL</span>
      </div>

      {/* Vertical Track Line */}
      <div className="relative flex flex-col items-center gap-3">
        <div className="absolute top-0 bottom-0 w-px bg-white/[0.08] -z-10" />

        {SECTIONS.map((sec) => {
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => scrollTo(sec.id)}
              className="group relative flex items-center justify-center p-1 focus:outline-none cursor-pointer"
              aria-label={`Jump to ${sec.name}`}
            >
              {/* Tooltip on hover */}
              <div
                className="absolute right-7 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap"
                style={{
                  background: "rgba(24, 24, 24, 0.95)",
                  border: "1px solid rgba(225, 6, 0, 0.4)",
                  color: "#FFFFFF",
                }}
              >
                {sec.label} // {sec.name}
              </div>

              {/* Pixel Block Indicator */}
              <div
                className={`transition-all duration-300 rounded-[2px] ${
                  isActive
                    ? "w-2.5 h-2.5 bg-[#E10600] shadow-[0_0_10px_#E10600]"
                    : "w-1.5 h-1.5 bg-zinc-600 group-hover:bg-[#C0C0C0]"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Bottom: Coordinates marker */}
      <div className="mt-2 text-[8px] font-mono text-zinc-600 rotate-90 tracking-widest origin-center">
        12°N 77°E
      </div>
    </aside>
  );
}
