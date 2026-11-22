// To add new photos: add imports and entries to the galleryPhotos array

import { useState, useEffect, useCallback } from "react"
import sameed1 from "../assets/images/personal/sameed_1.jpg"
import sameed2 from "../assets/images/personal/sameed_2.jpg"
import sameed3 from "../assets/images/personal/sameed_3.jpg"
import sameed4 from "../assets/images/personal/sameed_4.jpg"
import sameed5 from "../assets/images/personal/sameed_5.jpg"

const galleryPhotos = [
  {
    id: 1,
    src: sameed1,
    title: "Golden Hour",
    location: "Pakistan",
    category: "Travel",
  },
  {
    id: 2,
    src: sameed2,
    title: "Sun & Shades",
    location: "Coastal Retreat",
    category: "Beach",
  },
  {
    id: 3,
    src: sameed3,
    title: "Mountain Vibes",
    location: "Northern Peaks",
    category: "Nature",
  },
  {
    id: 4,
    src: sameed4,
    title: "City Wanderer",
    location: "Urban Escape",
    category: "Travel",
  },
  {
    id: 5,
    src: sameed5,
    title: "Serene Shores",
    location: "Seaside Haven",
    category: "Beach",
  },
]

const FILTERS = ["All", "Travel", "Beach", "Nature"]

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState("All")
  const [lightbox, setLightbox] = useState(null) // photo object or null
  const [hoveredId, setHoveredId] = useState(null)

  const filteredPhotos =
    activeFilter === "All"
      ? galleryPhotos
      : galleryPhotos.filter((p) => p.category === activeFilter)

  const closeLightbox = useCallback(() => setLightbox(null), [])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") closeLightbox()
    }
    if (lightbox) {
      document.addEventListener("keydown", handleKey)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.removeEventListener("keydown", handleKey)
      document.body.style.overflow = ""
    }
  }, [lightbox, closeLightbox])

  return (
    <div id="gallery" className="bg-[#181818] text-[#C0C0C0] pt-12">
      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center pt-32 pb-16 px-6 text-center overflow-hidden">
        {/* Background glow blobs */}
        <div
          aria-hidden
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(225,6,0,0.08) 0%, transparent 70%)",
          }}
        />
        <p className="text-xs uppercase tracking-[0.3em] text-[#E10600] mb-4 font-semibold font-mono flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#E10600] animate-ping" />
          Travel &nbsp;·&nbsp; Moments &nbsp;·&nbsp; Memories
        </p>
        <h1 className="text-6xl md:text-8xl font-black leading-none tracking-tight text-white font-space">
          MY WORLD
        </h1>
        <h2
          className="text-5xl md:text-7xl font-black leading-none tracking-tight mt-1 font-space"
          style={{
            background: "linear-gradient(90deg, #FFFFFF, #C0C0C0 40%, #E10600)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          THROUGH A LENS
        </h2>
        <p className="mt-6 text-[#C0C0C0] text-base md:text-lg max-w-xl leading-relaxed font-inter">
          Moments captured across places that made me feel alive.
        </p>
      </section>

      {/* ── Filter Tabs ── */}
      <section className="flex justify-center gap-3 flex-wrap px-6 pb-10">
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-full text-sm font-semibold tracking-wide border transition-all duration-300 font-space ${
                isActive
                  ? "border-[#E10600] text-white bg-[#E10600]"
                  : "border-[#3A3A3A] text-[#C0C0C0] hover:border-[#E10600]/60 hover:text-white bg-[#252525]"
              }`}
              style={
                isActive
                  ? { boxShadow: "0 0 20px rgba(225,6,0,0.4)" }
                  : {}
              }
            >
              {filter}
            </button>
          )
        })}
      </section>

      {/* ── Masonry Grid ── */}
      <main className="max-w-6xl mx-auto px-6 pb-24">
        {filteredPhotos.length === 0 ? (
          <p className="text-center text-slate-500 py-24 text-lg">
            No photos in this category yet.
          </p>
        ) : (
          <div className="columns-2 md:columns-3 gap-4 space-y-4">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                className="break-inside-avoid rounded-2xl overflow-hidden relative cursor-pointer group"
                style={{
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  transform:
                    hoveredId === photo.id ? "scale(1.03)" : "scale(1)",
                  boxShadow:
                    hoveredId === photo.id
                      ? "0 0 30px rgba(225,6,0,0.3)"
                      : "none",
                }}
                onClick={() => setLightbox(photo)}
                onMouseEnter={() => setHoveredId(photo.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full h-auto object-cover block"
                  loading="lazy"
                />
                {/* Hover overlay */}
                <div
                  className="absolute inset-0 flex flex-col justify-end p-4 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(24,24,24,0.92) 0%, transparent 60%)",
                    opacity: hoveredId === photo.id ? 1 : 0,
                  }}
                >
                  <p className="text-white font-bold text-sm leading-tight font-space">
                    {photo.title}
                  </p>
                  <p className="text-[#E10600] text-xs mt-0.5 font-medium tracking-wide font-mono">
                    📍 {photo.location}
                  </p>
                  <span
                    className="mt-2 self-start text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full border border-[#444444] text-[#C0C0C0] font-mono"
                  >
                    {photo.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer note */}
        <p className="text-center text-slate-600 mt-16 text-sm tracking-wide">
          More adventures coming soon... 🌍
        </p>
      </main>

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(5,8,22,0.95)" }}
          onClick={closeLightbox}
        >
          {/* Stop propagation on content so only backdrop click closes */}
          <div
            className="relative max-w-5xl w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute -top-10 right-0 text-slate-400 hover:text-white text-2xl transition-colors leading-none"
              aria-label="Close"
            >
              ✕
            </button>

            <img
              src={lightbox.src}
              alt={lightbox.title}
              className="rounded-2xl max-h-[80vh] object-contain w-full"
              style={{ boxShadow: "0 0 60px rgba(0,245,255,0.2)" }}
            />

            <div className="mt-4 text-center">
              <p className="text-white font-bold text-lg">{lightbox.title}</p>
              <p className="text-[#00f5ff] text-sm mt-1">
                📍 {lightbox.location}
              </p>
            </div>

            <p className="mt-3 text-slate-600 text-xs">
              Press <kbd className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px]">ESC</kbd> or click outside to close
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
