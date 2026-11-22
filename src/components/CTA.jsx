import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="cta p-8 rounded-2xl autopilot-card border border-white/10 my-8">
      <div className="flex-1">
        <span className="text-xs font-mono uppercase tracking-widest text-[#E10600] flex items-center gap-2 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E10600] animate-ping" />
          Ready to Collaborate
        </span>
        <h3 className="cta-text text-2xl md:text-3xl text-white font-space font-bold mt-1">
          Have an enterprise challenge or project in mind? <br className="sm:block hidden" />
          Let&apos;s build high-impact solutions together.
        </h3>
      </div>
      <a
        href="#contact"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
        }}
        className="autopilot-btn-primary group shrink-0"
      >
        <span>Let&apos;s Connect</span>
        <span className="autopilot-arrow-pill">
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </span>
      </a>
    </section>
  );
};

export default CTA;
