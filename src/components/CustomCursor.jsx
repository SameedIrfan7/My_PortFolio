/**
 * CustomCursor.jsx
 * ----------------
 * Inspired by productionportugal.com (Awwwards SOTD):
 * - Weighted, fluid cursor with smooth lerped inertia tracking
 * - Central precision dot + magnetic outer ring
 * - Hovering interactive elements turns the ring into a target box
 * - Graceful touch-device fallback (disabled on mobile touch screens)
 */

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const hoveredTargetRef = useRef(null);
  const targetRadiusRef = useRef("6px");
  const isHoveringRef = useRef(false);

  // Position references for smooth lerping
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });

  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on devices with fine pointer (mouse/trackpad, not touch)
    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.body.classList.add("custom-cursor-enabled");
    let animId;

    const handleMouseMove = (e) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Track the full bounds of interactive elements.
      const target = e.target.closest("[data-cursor], [data-cursor-label], a, button, .project-card, .gallery-card");
      if (target !== hoveredTargetRef.current) {
        hoveredTargetRef.current = target;
        if (target) {
          targetRadiusRef.current = getComputedStyle(target).borderRadius;
        }
        isHoveringRef.current = Boolean(target);
        setIsHovering(isHoveringRef.current);
      }
    };

    const handleMouseLeave = () => {
      hoveredTargetRef.current = null;
      isHoveringRef.current = false;
      setIsHovering(false);
      setIsVisible(false);
    };
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    // Smooth inertia render loop (Production Portugal weighted physics)
    const render = () => {
      // Lerp ring towards mouse position
      const ease = 0.18;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * ease;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * ease;

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`;
      }

      if (cursorRingRef.current) {
        const target = hoveredTargetRef.current;
        if (target?.isConnected) {
          const rect = target.getBoundingClientRect();
          cursorRingRef.current.style.transform = `translate3d(${rect.left}px, ${rect.top}px, 0)`;
          cursorRingRef.current.style.width = `${rect.width}px`;
          cursorRingRef.current.style.height = `${rect.height}px`;
          if (cursorRingRef.current.style.getPropertyValue("--target-radius") !== targetRadiusRef.current) {
            cursorRingRef.current.style.setProperty("--target-radius", targetRadiusRef.current);
          }
        } else {
          cursorRingRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
          cursorRingRef.current.style.width = "0px";
          cursorRingRef.current.style.height = "0px";
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.body.classList.remove("custom-cursor-enabled");
      cancelAnimationFrame(animId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* ── Center Precision Dot ── */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 -ml-1 -mt-1 w-2 h-2 rounded-full bg-[#E10600] pointer-events-none transition-opacity duration-200"
        style={{
          boxShadow: "0 0 8px #E10600",
          opacity: 1,
        }}
      />

      {/* ── Magnetic Outer Ring / Expanding Pill ── */}
      <div
        ref={cursorRingRef}
        className="fixed top-0 left-0 pointer-events-none flex items-center justify-center transition-all duration-300 ease-out"
        style={{
          transform: "translate3d(-100px, -100px, 0)",
        }}
      >
        {isHovering ? (
          <div className="cursor-target-box" />
        ) : (
          // Default State: Clean weighted ring
          <div
            className="-ml-4 -mt-4 w-8 h-8 rounded-full border border-white/40 pointer-events-none transition-transform duration-200"
            style={{
              backdropFilter: "blur(0.5px)",
            }}
          />
        )}
      </div>
    </div>
  );
}
