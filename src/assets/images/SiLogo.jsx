/**
 * SiLogo — futuristic "SI" monogram SVG component
 * Styled with Signal Red (#E10600) and Moonlit Silver (#C0C0C0).
 */

import React from "react";

const SiLogo = ({ className = "", width = 60, height = 40 }) => {
  return (
    <svg
      viewBox="0 0 60 40"
      width={width}
      height={height}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="SI Logo"
    >
      <defs>
        {/* Red & Silver Gradient */}
        <linearGradient id="si-red-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="35%" stopColor="#C0C0C0" />
          <stop offset="100%" stopColor="#E10600" />
        </linearGradient>

        <linearGradient id="si-accent-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E10600" />
          <stop offset="100%" stopColor="#990400" />
        </linearGradient>

        <filter id="si-red-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.5" result="blur1" />
          <feGaussianBlur stdDeviation="3" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <style>{`
          .si-mark {
            animation: si-red-pulse 2.8s ease-in-out infinite;
            transform-origin: 30px 20px;
          }
          @keyframes si-red-pulse {
            0%, 100% {
              filter: drop-shadow(0 0 3px #E10600) drop-shadow(0 0 8px rgba(225,6,0,0.5));
            }
            50% {
              filter: drop-shadow(0 0 7px #E10600) drop-shadow(0 0 16px rgba(225,6,0,0.8));
            }
          }
        `}</style>
      </defs>

      <g className="si-mark" filter="url(#si-red-glow)">
        {/* Top bar of S */}
        <polygon points="6,6 26,6 24,11 6,11" fill="url(#si-red-grad)" />

        {/* Upper-left stem */}
        <polygon points="6,6 11,6 9,19 6,19" fill="url(#si-red-grad)" />

        {/* Diagonal mid cross */}
        <polygon points="6,15 24,15 22,21 6,21" fill="url(#si-accent-grad)" />

        {/* Lower-right stem */}
        <polygon points="19,17 24,17 24,30 19,30" fill="url(#si-red-grad)" />

        {/* Bottom bar of S */}
        <polygon points="6,25 24,25 24,30 4,30" fill="url(#si-red-grad)" />

        {/* Letter "I" */}
        <polygon points="32,6 39,6 39,30 32,30" fill="url(#si-red-grad)" />

        {/* Top serif notch on I */}
        <polygon points="29,6 34,6 32,10 29,10" fill="#E10600" />

        {/* Bottom serif notch on I */}
        <polygon points="37,26 42,26 42,30 37,30" fill="#E10600" />

        {/* Decorative Signal Red dot */}
        <circle cx="47" cy="18" r="2.5" fill="#E10600" />

        {/* Tech baseline notch */}
        <rect x="4" y="34" width="46" height="1.5" rx="0.75" fill="#C0C0C0" opacity="0.4" />
        <rect x="36" y="34" width="14" height="1.5" rx="0.75" fill="#E10600" />
      </g>
    </svg>
  );
};

export default SiLogo;
