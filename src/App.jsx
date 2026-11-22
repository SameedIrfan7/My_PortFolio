import { useEffect } from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";

import {
  Footer,
  Navbar,
  CTA,
  CustomCursor,
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
        <CustomCursor />

        <Navbar />
        <ScrollHandler />

        <Home />

        <div className="bg-transparent">
          <About hideCTA={true} />
        </div>

        <div className="bg-transparent">
          <Projects hideCTA={true} />
        </div>

        <div className="max-w-6xl mx-auto px-6 md:px-12 py-8">
          <CTA />
        </div>

        <div className="bg-[#181818]">
          <Contact />
        </div>

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
