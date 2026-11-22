/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: "#2A2A2A",
          950: "#121212",
          900: "#181818",
          850: "#202020",
          800: "#252525",
          700: "#2A2A2A",
          600: "#383838",
          500: "#4A4A4A",
        },
        silver: {
          DEFAULT: "#C0C0C0",
          light: "#E4E4E4",
          bright: "#FFFFFF",
          muted: "#909090",
          dark: "#686868",
        },
        red: {
          signal: "#E10600",
          glow: "rgba(225, 6, 0, 0.4)",
          hover: "#FF231C",
          dark: "#990400",
        },
        'cyber-black': '#181818',
        'cyber-dark':  '#202020',
        'cyber-cyan':  '#E10600',
        'cyber-purple':'#C0C0C0',
      },
      fontFamily: {
        inter:     ["Inter", "sans-serif"],
        space:     ["Space Grotesk", "sans-serif"],
        mono:      ["JetBrains Mono", "monospace"],
        orbitron:  ["Orbitron", "sans-serif"],
        rajdhani:  ["Rajdhani", "sans-serif"],
        sora:      ["Sora", "sans-serif"],
        outfit:    ["Outfit", "sans-serif"],
        ibm:       ["IBM Plex Sans", "sans-serif"],
        ibmmono:   ["IBM Plex Mono", "monospace"],
        fira:      ["Fira Code", "monospace"],
        dmsans:    ["DM Sans", "sans-serif"],
        poppins:   ["Space Grotesk", "sans-serif"],
        worksans:  ["Inter", "sans-serif"],
      },
      boxShadow: {
        'red-glow': '0 0 25px rgba(225, 6, 0, 0.35)',
        'silver-glow': '0 0 20px rgba(192, 192, 192, 0.2)',
        'card': '0px 1px 2px 0px rgba(0, 0, 0, 0.05)'
      }
    },
  },
  plugins: [],
}
