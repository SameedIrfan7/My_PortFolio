import { useEffect } from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";

import {
  Footer,
  Navbar,
  CTA,
  CustomCursor,
  CinematicTransition,
  ScrollRail,
} from "./components";
import { About, Contact, Home, Projects } from "./pages";
import FlightWorld from "./components/FlightWorld";

// Smooth scroll controller for deep links (/about, #projects, etc.)
function ScrollHandler() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 150);
      }
    } else if (location.pathname && location.pathname !== "/") {
      const id = location.pathname.replace("/", "");
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 150);
      }
    }
  }, [location]);

  return null;
}

const SinglePagePortfolio = () => {
  return (
    <div className="relative overflow-x-hidden">
      <FlightWorld />
      <div className="relative z-10">
        {/* ── Production Portugal Inspired Custom Cursor ── */}
        <CustomCursor />

      {/* ── Yoyu.design Inspired Vertical Pixel Progress Rail ── */}
      <ScrollRail />

      {/* ── Fixed Glass Header ── */}
      <Navbar />
      <ScrollHandler />

      {/* ── 1. Hero Section (Unanim.studio Swiss Grid + Typewriter + Pixel Portrait) ── */}
      <Home />

      {/* ── Cinematic Transition: Hero -> About ── */}
      <CinematicTransition
        sectionNum="02"
        title="EXPERIENCE & CORE ARCHITECTURE"
        tickerText="COGNIZANT APPLICATION OPS // 4,000+ ENTERPRISE RECORDS <30s // ~95% FASTER AUTOMATION // CLAUDE CERTIFIED ARCHITECT"
      />

      {/* ── 2. About & Experience Section ── */}
      <div className="bg-transparent">
        <About hideCTA={true} />
      </div>

      {/* ── Cinematic Transition: About -> Projects ── */}
      <CinematicTransition
        sectionNum="03"
        title="FEATURED PRODUCTION PLATFORMS"
        tickerText="NAKKHIWORKS PRODUCTION // HYBRIDNOTES CLOUD // NURQURAN PWA // SUMMARIZE-AI // RECONFLOW ENTERPRISE"
      />

      {/* ── 3. Projects Showcase Section ── */}
      <div className="bg-transparent">
        <Projects hideCTA={true} />
      </div>

      {/* ── 4. Call To Action Banner ── */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-8">
        <CTA />
      </div>

      {/* ── Cinematic Transition: CTA -> Contact ── */}
      <CinematicTransition
        sectionNum="04"
        title="DIRECT COLLABORATION & INQUIRIES"
        tickerText="OPEN FOR HIGH-IMPACT ROLES // APPLICATION OPS & SRE // FULL-STACK & LLM INTEGRATION // LET'S CONNECT"
      />

      {/* ── 5. Interactive 3D Contact Section ── */}
      <div className="bg-[#181818]">
        <Contact />
      </div>

      {/* ── 6. Footer ── */}
      <Footer />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <main className="bg-[#181818] min-h-screen text-[#C0C0C0] font-inter selection:bg-[#E10600] selection:text-white">
      <Router>
        <SinglePagePortfolio />
      </Router>
    </main>
  );
};

export default App;
