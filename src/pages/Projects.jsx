import { useEffect, useRef, useState } from "react";
import { CTA } from "../components";
import { projects } from "../constants";

const CATEGORIES = ["All", "Live Web Apps", "Enterprise & Ops", "AI & ML"];

const Projects = ({ hideCTA = false }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [isVisible, setIsVisible] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setCarouselIndex(0);
  }, [activeCategory]);

  const filteredProjects = projects.filter((project) => {
    if (activeCategory === "All") return true;
    if (activeCategory === "Live Web Apps") return project.isLive === true;
    if (activeCategory === "Enterprise & Ops")
      return (
        project.badge === "Enterprise Ops" ||
        project.badge === "Distributed Data"
      );
    if (activeCategory === "AI & ML")
      return (
        project.badge === "Live AI Web App" ||
        project.badge === "ML & IoT" ||
        project.badge === "AI Automation" ||
        project.badge === "Edge-AI & PWA"
      );
    return true;
  });

  useEffect(() => {
    if (
      filteredProjects.length < 2 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return undefined;
    }

    const timer = setInterval(() => {
      setCarouselIndex((index) => (index + 1) % filteredProjects.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [activeCategory, filteredProjects.length]);

  const moveCarousel = (direction) => {
    setCarouselIndex((index) =>
      (index + direction + filteredProjects.length) % filteredProjects.length
    );
  };

  const radius = Math.min(
    500,
    Math.max(260, Math.round(200 / Math.tan(Math.PI / filteredProjects.length)))
  );

  return (
    <section id="projects" ref={sectionRef} className="max-container text-[#C0C0C0] pt-20">
      {/* Header */}
      <div className={`project-section-heading flex flex-col md:flex-row items-center justify-between gap-8 pb-8 pt-6 ${isVisible ? "is-visible" : ""}`}>
        <div className="flex-1">
          <span className="text-xs uppercase tracking-[0.25em] text-[#E10600] font-semibold font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E10600] animate-ping" />
            03 / Selected work
          </span>
          <h2 className="head-text mt-2 text-white font-space">
            Selected{" "}
            <span className="bg-gradient-to-r from-white via-[#C0C0C0] to-[#E10600] bg-clip-text text-transparent font-extrabold drop-shadow">
              Projects
            </span>
          </h2>

          <p className="text-[#C0C0C0] mt-4 leading-relaxed text-base max-w-xl font-inter">
            Production products, enterprise automation, and AI systems — selected for real-world impact, not just interesting code.
          </p>
        </div>

      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-2.5 my-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            aria-pressed={activeCategory === cat}
            className={`px-5 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
              activeCategory === cat
                ? "bg-[#E10600] text-white font-bold shadow-[0_0_20px_rgba(225,6,0,0.45)] border border-[#E10600]"
                : "bg-white/[0.06] text-[#C0C0C0] hover:text-white hover:bg-white/[0.12] border border-white/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Circular project carousel */}
      <div className="project-orbit my-8">
        {filteredProjects.map((project, index) => {
          const itemCount = filteredProjects.length;
          const offset = (index - carouselIndex + itemCount) % itemCount;
          const delta = offset > Math.floor(itemCount / 2) ? offset - itemCount : offset;
          const distance = Math.abs(delta);
          const isActive = distance === 0;
          const angle = delta * (Math.PI * 2 / itemCount);
          const x = Math.sin(angle) * 550;
          const y = Math.sin(angle) * 105;
          const scale = isActive ? 1 : distance === 1 ? 0.78 : 0.62;

          return (
          <div
            aria-hidden={!isActive}
            className={`project-orbit-card group relative flex min-h-[450px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#202020] transition-all duration-700 ${
              isActive
                ? "border-[#E10600]/60 shadow-[0_18px_50px_rgba(0,0,0,0.55)]"
                : "pointer-events-none"
            } ${isVisible ? "is-visible" : ""}`}
            key={project.name}
            style={{
              width: isActive ? "min(84vw, 410px)" : "min(62vw, 300px)",
              height: isActive ? "450px" : "230px",
              transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${isActive ? 50 : -distance * 24}px) scale(${scale})`,
              opacity: distance === 0 ? 1 : distance === 1 ? 0.5 : distance === 2 ? 0.08 : 0,
              zIndex: itemCount - distance,
            }}
          >
            {!isActive ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 p-5 text-center">
                <img
                  src={project.iconUrl}
                  alt=""
                  className="h-12 w-12 object-contain"
                />
                <span className="text-sm font-space font-semibold text-white">
                  {project.name}
                </span>
              </div>
            ) : (
              <>
            <div className="project-preview relative h-44 overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(225,6,0,0.18),transparent_38%),linear-gradient(135deg,#282828,#181818)]">
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
              <div className="absolute left-5 right-5 top-5 z-10 flex items-center justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-[#171717] p-2.5 shadow-lg">
                  <img
                    src={project.iconUrl}
                    alt=""
                    className="w-full h-full object-contain filter brightness-110"
                  />
                </div>
                {project.badge && (
                  <span
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-mono ${
                      project.isLive
                        ? "text-[#22c55e] border-[#22c55e]/40 bg-[#22c55e]/10 shadow-[0_0_12px_rgba(34,197,94,0.2)]"
                        : "text-[#C0C0C0] border-white/10 bg-white/[0.05]"
                    }`}
                  >
                    {project.isLive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-ping" />
                    )}
                    {project.badge}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-xl font-space font-semibold leading-tight text-white group-hover:text-[#E10600] transition-colors">
                {project.name}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-400 font-inter">
                {project.description}
              </p>

              {project.highlights?.length > 0 && (
                <ul className="mt-5 grid gap-2.5">
                  {project.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2.5 text-sm text-[#C0C0C0]">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#E10600]" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              )}

              {project.stack?.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.stack.map((technology) => (
                    <span key={technology} className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] uppercase tracking-wider text-slate-300 font-mono">
                      {technology}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/[0.08] px-6 py-4 font-mono">
              {project.live ? (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={isActive ? 0 : -1}
                  className="autopilot-btn-primary !px-4 !py-2 !text-xs group/btn"
                >
                  <span>View Live</span>
                  <span className="autopilot-arrow-pill !w-5 !h-5">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H8M17 7V16" />
                    </svg>
                  </span>
                </a>
              ) : (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={isActive ? 0 : -1}
                  className="autopilot-btn !px-4 !py-2 !text-xs group/btn"
                >
                  <span>View Project</span>
                  <span className="autopilot-arrow-pill !w-5 !h-5">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </a>
              )}

              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={isActive ? 0 : -1}
                  className="text-xs text-[#909090] hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>GitHub</span>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              )}
            </div>
              </>
            )}
          </div>
          );
        })}
      </div>

      {filteredProjects.length > 1 && (
        <div className="mb-10 flex items-center justify-between">
          <div className="flex gap-2" aria-label="Project carousel position">
            {filteredProjects.map((project, index) => (
              <button
                key={project.name}
                type="button"
                aria-label={`Show ${project.name}`}
                aria-current={index === carouselIndex ? "true" : undefined}
                onClick={() => setCarouselIndex(index)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === carouselIndex ? "w-8 bg-[#E10600]" : "w-3 bg-white/20"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-slate-400">
              {String(carouselIndex + 1).padStart(2, "0")} / {String(filteredProjects.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => moveCarousel(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white transition hover:border-[#E10600] hover:bg-[#E10600]"
              aria-label="Previous project"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => moveCarousel(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white transition hover:border-[#E10600] hover:bg-[#E10600]"
              aria-label="Next project"
            >
              →
            </button>
          </div>
        </div>
      )}

      {!hideCTA && (
        <>
          <hr className="border-white/[0.08] my-10" />
          <CTA />
        </>
      )}
    </section>
  );
};

export default Projects;
