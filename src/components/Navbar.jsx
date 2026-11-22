import { useState, useEffect } from "react";
import SiLogo from "../assets/images/SiLogo";

const navItems = [
  { name: "Home", targetId: "home" },
  { name: "About", targetId: "about" },
  { name: "Projects", targetId: "projects" },
  { name: "Contact", targetId: "contact" },
];

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
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

          {/* Right: LinkedIn + mobile menu */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.linkedin.com/in/sameed-irfan-7b767622b/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C0C0C0] hover:text-[#E10600] transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <LinkedInIcon />
            </a>

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
