import { useState, useEffect } from "react";
import SiLogo from "../assets/images/SiLogo";
import { gitLink } from "../constants";

const navItems = [
  { name: "Home", targetId: "home" },
  { name: "About", targetId: "about" },
  { name: "Projects", targetId: "projects" },
  { name: "Contact", targetId: "contact" },
];

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 220;
      const sections = ["contact", "projects", "about", "home"];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (targetId) => {
    closeMenu();
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const githubUrl =
    gitLink && gitLink.length > 0 ? gitLink[0].link : "https://github.com/SameedIrfan7";

  return (
    <header
      className="fixed top-0 w-full z-50 transition-all duration-300"
      style={{
        background: "rgba(24, 24, 24, 0.92)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(192, 192, 192, 0.12)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => scrollTo("home")}
            className="flex items-center shrink-0 focus:outline-none cursor-pointer"
            aria-label="Scroll to top"
          >
            <SiLogo />
          </button>

          {/* Desktop Single-Page Nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navItems.map((item) => {
              const isActive = activeSection === item.targetId;
              return (
                <button
                  key={item.name}
                  onClick={() => scrollTo(item.targetId)}
                  className={`text-sm font-medium transition-colors duration-200 tracking-wide font-space cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? "text-[#E10600] font-semibold"
                      : "text-[#C0C0C0] hover:text-white"
                  }`}
                >
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E10600]" />
                  )}
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: GitHub + Hamburger */}
          <div className="flex items-center gap-4">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C0C0C0] hover:text-[#E10600] transition-colors duration-200"
              aria-label="GitHub"
            >
              <GitHubIcon />
            </a>

            {/* Hamburger (mobile only) */}
            <button
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 focus:outline-none"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              <span
                className={`block h-0.5 w-6 bg-slate-300 transition-all duration-300 ${
                  isMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-slate-300 transition-all duration-300 ${
                  isMenuOpen ? "opacity-0 scale-x-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-slate-300 transition-all duration-300 ${
                  isMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{
          background: "rgba(24, 24, 24, 0.98)",
          borderTop: isMenuOpen ? "1px solid rgba(225, 6, 0, 0.2)" : "none",
        }}
      >
        <nav className="flex flex-col px-6 py-4 gap-4">
          {navItems.map((item) => {
            const isActive = activeSection === item.targetId;
            return (
              <button
                key={item.name}
                onClick={() => scrollTo(item.targetId)}
                className={`text-left text-sm font-medium transition-colors duration-200 tracking-wide font-space flex items-center gap-2 ${
                  isActive
                    ? "text-[#E10600] font-semibold"
                    : "text-[#C0C0C0] hover:text-white"
                }`}
              >
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E10600]" />
                )}
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
