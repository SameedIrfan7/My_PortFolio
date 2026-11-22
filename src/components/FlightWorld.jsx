import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { Suspense } from "react";

import { Plane } from "../models";

const clamp01 = (value) => Math.min(1, Math.max(0, value));
const smoothstep = (value) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};

function FlyingPlane({ progress }) {
  const planeRef = useRef();

  useFrame(({ clock, viewport }) => {
    if (!planeRef.current) return;

    const time = clock.elapsedTime;
    const horizontalPath = (progress - 0.5) * viewport.width * 0.72;
    const wave = progress * Math.PI * 4 + time * 0.22;
    const approach = smoothstep(progress / 0.42);
    const departure = smoothstep((progress - 0.42) / 0.58);
    const depth = progress < 0.42
      ? -10 + approach * 13
      : 3 - departure * 25;
    const size = progress < 0.42
      ? 0.4 + approach * 0.7
      : 1.1 - departure;

    planeRef.current.position.set(
      horizontalPath + Math.sin(time * 0.35) * 0.18,
      Math.sin(wave) * 0.85,
      depth + Math.cos(wave) * 0.25
    );
    planeRef.current.rotation.set(
      -0.12 + Math.sin(wave) * 0.1,
      -0.3 + Math.sin(wave) * 0.22,
      -Math.cos(wave) * 0.24
    );
    planeRef.current.scale.setScalar(size);
  });

  return (
    <group ref={planeRef}>
      <Plane isRotating position={[0, 0, 0]} scale={[2, 2, 2]} />
    </group>
  );
}

export default function FlightWorld() {
  const [flight, setFlight] = useState({ active: false, progress: 0 });

  useEffect(() => {
    const updateFlight = () => {
      const experience = document.getElementById("about");
      const projects = document.getElementById("projects");
      if (!experience || !projects) return;

      const start = experience.getBoundingClientRect().top + window.scrollY;
      const end = projects.getBoundingClientRect().bottom + window.scrollY;
      const position = window.scrollY + window.innerHeight * 0.5;
      const progress = clamp01((position - start) / Math.max(end - start, 1));
      const fadeIn = smoothstep((position - (start - window.innerHeight * 0.5)) / window.innerHeight);
      const fadeOut = smoothstep((end + window.innerHeight * 0.5 - position) / window.innerHeight);
      const active = window.scrollY + window.innerHeight >= start && window.scrollY <= end;

      setFlight({
        active,
        progress,
        opacity: Math.min(fadeIn, fadeOut) * 0.62,
      });
    };

    updateFlight();
    window.addEventListener("scroll", updateFlight, { passive: true });
    window.addEventListener("resize", updateFlight);
    return () => {
      window.removeEventListener("scroll", updateFlight);
      window.removeEventListener("resize", updateFlight);
    };
  }, []);

  if (!flight.active) return null;

  return (
    <div className="flight-world" style={{ opacity: flight.opacity }} aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 9], fov: 45 }}>
        <ambientLight intensity={1.4} />
        <directionalLight position={[4, 6, 5]} intensity={1.7} />
        <pointLight position={[-5, 2, 3]} intensity={1.5} color="#E10600" />
        <Stars radius={36} depth={22} count={260} factor={1.4} saturation={0} fade speed={0.2} />
        <Suspense fallback={null}>
          <FlyingPlane progress={flight.progress} />
        </Suspense>
      </Canvas>
    </div>
  );
}
