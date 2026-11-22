/**
 * PixelPortrait.jsx
 * -----------------
 * Digital Pixel & Particle Assembly Portrait for Sameed Irfan.
 *
 * Inspired by Autopilot (launch.joinautopilot.com) & high-end 3D creative tech:
 * - Thousands of small square pixel chunks / particles scatter across 3D space
 * - They stream dynamically inward along curved vortex arcs and "come & join together"
 * - When assembled, they lock into place and crystallize into the high-resolution,
 *   crystal-clear portrait with an authentic Autopilot dot-matrix digital grid overlay
 * - Full 3D interactive mouse parallax (smooth tilt following cursor)
 * - Zero accidental holes or distorted chest (repulsion bug removed)
 * - Click anywhere or press [⚡ RE-ASSEMBLE] to trigger the assembly sequence on demand
 */

import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import portraitCutoutUrl from "../assets/images/personal/sameed_portrait_cutout.png";

// ─── Grid & Dimensions ────────────────────────────────────────────────────────
const COLS = 110;
const ROWS = 125;
const PORTRAIT_H = 3.9;
const PORTRAIT_W = PORTRAIT_H * (502 / 573); // ≈ 3.416 world width

// ─── Easing ───────────────────────────────────────────────────────────────────
function easeOutBack(t, s = 1.1) {
  const t1 = t - 1;
  return t1 * t1 * ((s + 1) * t1 + s) + 1;
}

function easeInCubic(t) {
  return t * t * t;
}

// ─── 32x32 crisp square pixel texture ─────────────────────────────────────────
function createSquarePixelTexture() {
  const cv = document.createElement("canvas");
  cv.width = 32;
  cv.height = 32;
  const ctx = cv.getContext("2d");

  // Solid white square with slight 1.5px margin so pixels read as discrete digital tiles
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(2, 2, 28, 28);

  const texture = new THREE.CanvasTexture(cv);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  return texture;
}

// ─── Generate random scatter in 3D space ───────────────────────────────────────
function generateScatterPoint(out, index, spread = 11) {
  const angle = Math.random() * Math.PI * 2;
  const elev = (Math.random() - 0.5) * Math.PI;
  const dist = 5.0 + Math.random() * spread;
  out[index * 3]     = dist * Math.cos(elev) * Math.cos(angle);
  out[index * 3 + 1] = dist * Math.sin(elev);
  out[index * 3 + 2] = dist * Math.cos(elev) * Math.sin(angle) - 1.0;
}

// ─── 3D Particle Assembly Simulation ──────────────────────────────────────────
function ParticleMesh({
  pixelData,
  manualTrigger,
  onPhaseChange,
  onAssemblyProgress,
  mousePosRef,
}) {
  const pointsRef = useRef();
  const groupRef  = useRef();
  const squareTexture = useMemo(() => createSquarePixelTexture(), []);

  // Sample particles from cropped cutout
  const particles = useMemo(() => {
    if (!pixelData) return null;

    const { data, width, height } = pixelData;
    const valid = [];

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const px = Math.floor((c / COLS) * width);
        const py = Math.floor((r / ROWS) * height);
        const idx = (py * width + px) * 4;
        const alpha = data[idx + 3];

        if (alpha < 55) continue; // skip transparent background

        const red   = data[idx]     / 255;
        const green = data[idx + 1] / 255;
        const blue  = data[idx + 2] / 255;

        // Slight luminance relief for 3D depth
        const lum = 0.299 * red + 0.587 * green + 0.114 * blue;

        const tx = ((c / (COLS - 1)) - 0.5) * PORTRAIT_W;
        const ty = (0.5 - (r / (ROWS - 1))) * PORTRAIT_H;
        const tz = (lum - 0.5) * 0.12;

        valid.push({
          r: red,
          g: green,
          b: blue,
          tx,
          ty,
          tz,
          dist: Math.hypot(tx, ty),
        });
      }
    }

    const count = valid.length;
    const positions = new Float32Array(count * 3);
    const colors    = new Float32Array(count * 3);
    const targets   = new Float32Array(count * 3);
    const scatters  = new Float32Array(count * 3);
    const delays    = new Float32Array(count);
    const arcs      = new Float32Array(count);

    const maxDist = Math.hypot(PORTRAIT_W / 2, PORTRAIT_H / 2);

    for (let i = 0; i < count; i++) {
      const p = valid[i];

      targets[i * 3]     = p.tx;
      targets[i * 3 + 1] = p.ty;
      targets[i * 3 + 2] = p.tz;

      colors[i * 3]     = p.r;
      colors[i * 3 + 1] = p.g;
      colors[i * 3 + 2] = p.b;

      generateScatterPoint(scatters, i);

      positions[i * 3]     = scatters[i * 3];
      positions[i * 3 + 1] = scatters[i * 3 + 1];
      positions[i * 3 + 2] = scatters[i * 3 + 2];

      delays[i] = (p.dist / maxDist) * 0.25 + Math.random() * 0.25;
      arcs[i]   = (Math.random() - 0.5) * 1.5;
    }

    return { positions, colors, targets, scatters, delays, arcs, count };
  }, [pixelData]);

  const animState = useRef({
    phase: 1, // start assembling immediately
    time: 0,
  });

  // Re-trigger assembly
  useEffect(() => {
    if (manualTrigger > 0 && particles) {
      animState.current.phase = 0;
      animState.current.time = 0;
      for (let i = 0; i < particles.count; i++) {
        generateScatterPoint(particles.scatters, i);
      }
    }
  }, [manualTrigger, particles]);

  useFrame((state, delta) => {
    if (!particles || !pointsRef.current || !groupRef.current) return;

    const { positions, targets, scatters, delays, arcs, count } = particles;
    const pos = pointsRef.current.geometry.attributes.position;
    const as = animState.current;
    as.time += delta;

    // Smooth 3D mouse parallax tilt (NO HOLE REPULSION!)
    const mx = mousePosRef.current.x < 100 ? mousePosRef.current.x : 0;
    const my = mousePosRef.current.y < 100 ? mousePosRef.current.y : 0;
    const targetRotX = -my * 0.24;
    const targetRotY = mx * 0.30;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, delta * 5);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, delta * 5);

    const T_SCATTER_HOLD = 0.3;
    const T_ASSEMBLE     = 2.0;
    const T_ASSEMBLED    = 6.0;
    const T_DISPERSE     = 1.2;

    if (as.phase === 0) {
      // SCATTER
      onPhaseChange?.("SCATTERED");
      onAssemblyProgress?.(0);
      if (as.time >= T_SCATTER_HOLD) {
        as.phase = 1;
        as.time = 0;
      }
    } else if (as.phase === 1) {
      // ASSEMBLING (Come & Join Together)
      onPhaseChange?.("ASSEMBLING");
      const overallT = Math.min(1, as.time / T_ASSEMBLE);
      onAssemblyProgress?.(overallT);

      for (let i = 0; i < count; i++) {
        const d = delays[i];
        const pRaw = Math.max(0, Math.min(1, (overallT - d) / (1 - d)));
        const p = easeOutBack(pRaw, 1.05);

        const arcCurve = Math.sin(pRaw * Math.PI) * arcs[i];

        const sx = scatters[i * 3];
        const sy = scatters[i * 3 + 1];
        const sz = scatters[i * 3 + 2];

        const tx = targets[i * 3];
        const ty = targets[i * 3 + 1];
        const tz = targets[i * 3 + 2];

        pos.array[i * 3]     = sx + (tx - sx) * p;
        pos.array[i * 3 + 1] = sy + (ty - sy) * p + arcCurve * 0.25;
        pos.array[i * 3 + 2] = sz + (tz - sz) * p + arcCurve;
      }

      if (overallT >= 1) {
        as.phase = 2;
        as.time = 0;
      }
    } else if (as.phase === 2) {
      // ASSEMBLED (LOCKED & BREATHING IN HIGH FIDELITY)
      onPhaseChange?.("ASSEMBLED");
      onAssemblyProgress?.(1);
      const elapsed = state.clock.getElapsedTime();

      for (let i = 0; i < count; i++) {
        const tx = targets[i * 3];
        const ty = targets[i * 3 + 1];
        const tz = targets[i * 3 + 2];

        // Subtle organic breathing wave across the surface
        const idleWave = Math.sin(elapsed * 2.0 + tx * 2.5 + ty * 2) * 0.01;

        pos.array[i * 3]     = tx;
        pos.array[i * 3 + 1] = ty + idleWave;
        pos.array[i * 3 + 2] = tz;
      }

      if (as.time >= T_ASSEMBLED) {
        as.phase = 3;
        as.time = 0;
        for (let i = 0; i < count; i++) {
          generateScatterPoint(scatters, i);
        }
      }
    } else if (as.phase === 3) {
      // DISPERSING
      onPhaseChange?.("DISPERSING");
      const overallT = Math.min(1, as.time / T_DISPERSE);
      onAssemblyProgress?.(1 - overallT);

      for (let i = 0; i < count; i++) {
        const d = delays[i] * 0.5;
        const pRaw = Math.max(0, Math.min(1, (overallT - d) / (1 - d)));
        const p = easeInCubic(pRaw);

        const tx = targets[i * 3];
        const ty = targets[i * 3 + 1];
        const tz = targets[i * 3 + 2];

        const sx = scatters[i * 3];
        const sy = scatters[i * 3 + 1];
        const sz = scatters[i * 3 + 2];

        pos.array[i * 3]     = tx + (sx - tx) * p;
        pos.array[i * 3 + 1] = ty + (sy - ty) * p;
        pos.array[i * 3 + 2] = tz + (sz - tz) * p;
      }

      if (overallT >= 1) {
        as.phase = 0;
        as.time = 0;
      }
    }

    pos.needsUpdate = true;
  });

  if (!particles) return null;

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particles.positions, 3]}
            count={particles.count}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[particles.colors, 3]}
            count={particles.count}
          />
        </bufferGeometry>
        <pointsMaterial
          map={squareTexture}
          size={0.048}
          vertexColors
          sizeAttenuation
          transparent
          opacity={0.92}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

// ─── Subtle Cyber Rotating Rings ──────────────────────────────────────────────
function CyberRings() {
  const ringRef1 = useRef();
  const ringRef2 = useRef();

  useFrame((_, delta) => {
    if (ringRef1.current) ringRef1.current.rotation.z += delta * 0.12;
    if (ringRef2.current) ringRef2.current.rotation.z -= delta * 0.08;
  });

  return (
    <group position={[0, 0, -0.3]}>
      <mesh ref={ringRef1}>
        <torusGeometry args={[2.35, 0.008, 16, 120]} />
        <meshBasicMaterial color="#E10600" transparent opacity={0.25} />
      </mesh>
      <mesh ref={ringRef2}>
        <torusGeometry args={[2.55, 0.006, 16, 120]} />
        <meshBasicMaterial color="#C0C0C0" transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

// ─── Main Exported Component ──────────────────────────────────────────────────
export default function PixelPortrait({ compact = false }) {
  const [pixelData, setPixelData] = useState(null);
  const [triggerCount, setTriggerCount] = useState(0);
  const [statusText, setStatusText] = useState("INITIALIZING...");
  const [assemblyProgress, setAssemblyProgress] = useState(0); // 0 (scattered) to 1 (locked)
  const [pixelCount, setPixelCount] = useState(7030);

  // Mouse tracking in container coordinates [-1..1], initialized OUT OF RANGE
  // so no accidental hover/repel can ever trigger when user hasn't touched it!
  const mousePosRef = useRef({ x: 9999, y: 9999 });
  const containerRef = useRef();

  // Load cropped portrait cutout and extract high-resolution RGBA pixel data
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = portraitCutoutUrl;

    img.onload = () => {
      const W = COLS * 2;
      const H = ROWS * 2;
      const cv = document.createElement("canvas");
      cv.width = W;
      cv.height = H;
      const ctx = cv.getContext("2d");
      ctx.drawImage(img, 0, 0, W, H);
      const data = ctx.getImageData(0, 0, W, H);
      setPixelData(data);

      let active = 0;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const px = Math.floor((c / COLS) * W);
          const py = Math.floor((r / ROWS) * H);
          const idx = (py * W + px) * 4;
          if (data.data[idx + 3] >= 55) active++;
        }
      }
      setPixelCount(active);
    };
  }, []);

  // Mouse move handler for smooth 3D parallax tilt
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    mousePosRef.current = { x, y };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mousePosRef.current = { x: 9999, y: 9999 };
  }, []);

  const handleReassemble = useCallback(() => {
    setTriggerCount((prev) => prev + 1);
  }, []);

  // Calculate high-resolution photo opacity based on assembly progress
  // As particles reach 0.75+ of assembly, the crisp, detailed face seamlessly materializes
  const photoOpacity = Math.max(0, Math.min(1, (assemblyProgress - 0.5) / 0.5));

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleReassemble}
      className="relative select-none cursor-pointer group"
      style={{
        width: compact ? "min(100%, 280px)" : "440px",
        height: compact ? "356px" : "560px",
        flexShrink: 0,
      }}
      title="Click anywhere to shatter & re-assemble pixels"
    >
      {/* ── Soft Ambient Glow Behind Canvas ── */}
      <div
        className="absolute inset-0 pointer-events-none rounded-3xl"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(225,6,0,0.12) 0%, rgba(192,192,192,0.05) 45%, transparent 75%)",
          filter: "blur(24px)",
        }}
      />

      {/* ── HIGH-RESOLUTION SOLID PORTRAIT WITH AUTOPILOT DOT-MATRIX OVERLAY ── */}
      {/* Materializes seamlessly as the pixel chunks lock together! */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500 z-10"
        style={{
          opacity: photoOpacity * 0.95,
        }}
      >
        <div
          className="relative flex items-center justify-center"
          style={{
            width: compact ? "218px" : "340px",
            height: compact ? "278px" : "440px",
          }}
        >
          {/* Crisp, high-contrast portrait cutout */}
          <img
            src={portraitCutoutUrl}
            alt="Sameed Irfan"
            className="w-full h-full object-contain filter contrast-110 drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
            style={{
              maskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
            }}
          />

          {/* Autopilot Futuristic Digital Dot-Matrix Scan Grid */}
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(225, 6, 0, 0.35) 1px, transparent 1px), radial-gradient(circle, rgba(192, 192, 192, 0.2) 1px, transparent 1px)",
              backgroundSize: "8px 8px, 16px 16px",
              backgroundPosition: "0 0, 4px 4px",
              mixBlendMode: "screen",
              opacity: 0.55,
            }}
          />

          {/* Subtle Cyber Holographic Scan Beam */}
          <div
            className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#E10600]/40 to-transparent pointer-events-none animate-pulse"
            style={{
              top: "40%",
              filter: "blur(1px)",
            }}
          />
        </div>
      </div>

      {/* ── 3D Canvas with 8,000+ Pixel Chunks & Rotating Rings ── */}
      <Canvas
        className="w-full h-full relative z-20 pointer-events-none"
        camera={{ position: [0, 0, 5.0], fov: 46, near: 0.01, far: 100 }}
        dpr={compact ? 1 : undefined}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.6} />
        <CyberRings />
        {pixelData && (
          <ParticleMesh
            pixelData={pixelData}
            manualTrigger={triggerCount}
            onPhaseChange={setStatusText}
            onAssemblyProgress={setAssemblyProgress}
            mousePosRef={mousePosRef}
          />
        )}
      </Canvas>

      {/* ── Clean Cyber Corner Brackets [ ] ── */}
      <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-[#E10600]/80 z-30 pointer-events-none transition-colors group-hover:border-[#E10600]" />
      <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-[#C0C0C0]/60 z-30 pointer-events-none transition-colors group-hover:border-white" />
      <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-[#C0C0C0]/60 z-30 pointer-events-none transition-colors group-hover:border-white" />
      <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-[#E10600]/80 z-30 pointer-events-none transition-colors group-hover:border-[#E10600]" />

      {/* ── Sleek Cyber HUD Header ── */}
      <div className="absolute top-4 left-5 right-5 z-30 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#E10600] animate-pulse shadow-[0_0_8px_#E10600]" />
          <span className="text-[11px] font-mono tracking-wider text-[#C0C0C0] uppercase">
            NEURAL PIXEL MATRIX
          </span>
        </div>
        <span className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">
          {statusText}
        </span>
      </div>

      {/* ── Sleek Cyber Bottom Bar: Re-Assemble Action & Pixel Count ── */}
      <div className="absolute bottom-4 left-5 right-5 z-30 flex items-center justify-between">
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider pointer-events-none">
          {pixelCount.toLocaleString()} PIXELS
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleReassemble();
          }}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium transition-all duration-300 hover:scale-105"
          style={{
            background: "rgba(35, 35, 35, 0.85)",
            border: "1px solid rgba(225, 6, 0, 0.45)",
            color: "#FFFFFF",
            backdropFilter: "blur(10px)",
            boxShadow: "0 0 12px rgba(225, 6, 0, 0.25)",
          }}
        >
          <span className="text-[#E10600] font-bold">⚡</span>
          <span>RE-ASSEMBLE</span>
        </button>
      </div>

      {/* ── Loading Overlay ── */}
      {!pixelData && (
        <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
          <div className="flex flex-col items-center gap-2">
            <span className="w-6 h-6 border-2 border-[#E10600] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono text-[#C0C0C0] tracking-widest">
              INITIALIZING PIXELS...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
