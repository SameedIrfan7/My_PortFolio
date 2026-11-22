import { useEffect, useRef, useState } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";

import { CTA } from "../components";
import { experiences, skills } from "../constants";
import claudeLogo from "../assets/icons/claude.svg";

import "react-vertical-timeline-component/style.min.css";

const certifications = [
  {
    title: "Claude Certified Architect – Foundations",
    issuer: "Anthropic",
    badge: "AI Architecture",
    color: "#E10600",
    icon: claudeLogo
  },
  {
    title: "DevOps Foundation Training",
    issuer: "HCL Software",
    badge: "CI/CD & Automation",
    color: "#C0C0C0"
  },
  {
    title: "B.E. Information Science & Engineering",
    issuer: "PES College of Engineering, Mandya (2021 – 2025)",
    badge: "Degree · CGPA: 7.6",
    color: "#E10600"
  }
];

const About = ({ hideCTA = false }) => {
  const credentialsGridRef = useRef(null);
  const [visibleCredentialCards, setVisibleCredentialCards] = useState([]);

  useEffect(() => {
    const cards = Array.from(
      credentialsGridRef.current?.querySelectorAll("[data-credential-index]") || []
    );

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      setVisibleCredentialCards(cards.map((card) => Number(card.dataset.credentialIndex)));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const enteringCards = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => Number(entry.target.dataset.credentialIndex));

        if (enteringCards.length) {
          setVisibleCredentialCards((visible) =>
            Array.from(new Set([...visible, ...enteringCards]))
          );
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="max-container text-[#C0C0C0] pt-20">
      {/* Header */}
      <div className="pb-12">
        <div className="max-w-3xl">
          <span className="text-xs uppercase tracking-[0.25em] text-[#E10600] font-semibold font-mono">
            Experience &amp; core architecture
          </span>
          <h2 className="head-text mt-3 text-white">
            Systems,{" "}
            <span className="bg-gradient-to-r from-white via-[#C0C0C0] to-[#E10600] bg-clip-text text-transparent font-extrabold drop-shadow">
              data &amp; automation
            </span>
          </h2>

          <div className="mt-5 flex flex-col gap-4 text-[#C0C0C0] leading-relaxed text-base md:text-lg font-inter">
            <p>
              Software Engineer with 20+ months at <strong className="text-white">Cognizant</strong> building mission-critical enterprise automation, data pipelines, and scalable full-stack applications.
            </p>
            <p className="text-sm text-slate-400">
              Built an automated reconciliation engine that cut a 60–90 minute daily check across 4,000+ enterprise records down to under 30 seconds (~95% faster), adopted from day one. Claude Certified Architect specializing in Python, JavaScript, Java, SQL, and distributed data systems.
            </p>
          </div>

          {/* Quick Metrics in Signal Red, White, Silver */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-[#333333]">
            <div className="flex flex-col">
              <span className="text-2xl md:text-3xl font-black text-[#E10600] font-space">~95%</span>
              <span className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono">Process Acceleration</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl md:text-3xl font-black text-white font-space">4,000+</span>
              <span className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono">Records Automated</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl md:text-3xl font-black text-[#C0C0C0] font-space">20+ Mo.</span>
              <span className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono">Enterprise Exp.</span>
            </div>
          </div>
        </div>

      </div>

      {/* ── Credentials & Education ── */}
      <div className="py-12 border-t border-[#333333]">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#E10600] shadow-[0_0_10px_#E10600]" />
          <h3 className="subhead-text text-white font-space">Credentials &amp; Education</h3>
        </div>

        <div ref={credentialsGridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {certifications.map((item, index) => (
            <div
              key={item.title}
              data-credential-index={index}
              style={{
                transitionDelay: `${index * 120}ms`,
                background: "rgba(36, 36, 36, 0.46)",
                borderColor: "rgba(192, 192, 192, 0.18)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
              className={`credential-card ${
                index % 2 === 0 ? "credential-card-from-left" : "credential-card-from-right"
              } ${
                visibleCredentialCards.includes(index) ? "is-visible" : ""
              } p-6 rounded-2xl bg-[#242424] border border-[#383838] hover:border-[#E10600]/60 hover:shadow-[0_0_25px_rgba(225,6,0,0.15)] flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider"
                    style={{
                      background: `${item.color}18`,
                      color: item.color,
                      border: `1px solid ${item.color}45`,
                    }}
                  >
                    {item.badge}
                  </span>
                  {item.icon && (
                    <img
                      src={item.icon}
                      alt={item.title}
                      className="w-5 h-5 object-contain"
                    />
                  )}
                </div>
                <h4 className="text-lg font-semibold text-white mt-4 font-space">
                  {item.title}
                </h4>
              </div>
              <p className="text-sm text-slate-400 mt-2 font-mono">
                {item.issuer}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Skills Section (Charcoal + Moonlit Silver + Red Accents) ── */}
      <div className="py-12 border-t border-[#333333] flex flex-col">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.4)]" />
          <h3 className="subhead-text text-white font-space">Technical Arsenal</h3>
        </div>
        <p className="text-slate-400 mt-2 text-sm font-inter">
          Core technologies, frameworks, and pipelines I engineer with daily.
        </p>

        <div className="mt-10 flex flex-wrap gap-7">
          {skills.map((skill) => (
            <div className="block-container w-24 h-24 group" key={skill.name}>
              <div className="btn-back rounded-xl bg-gradient-to-tr from-[#E10600]/30 to-[#C0C0C0]/25 group-hover:shadow-[0_0_20px_rgba(225,6,0,0.4)] transition-all" />
              <div className="btn-front rounded-xl flex flex-col justify-center items-center bg-[#252525] border border-[#3A3A3A] group-hover:border-[#E10600] transition-all p-2">
                <img
                  src={skill.imageUrl}
                  alt={skill.name}
                  className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300"
                />
                <span className="text-[11px] text-[#C0C0C0] font-medium mt-1.5 text-center truncate w-full font-mono">
                  {skill.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Work Experience Timeline ── */}
      <div className="py-16 border-t border-[#333333]">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#E10600] shadow-[0_0_10px_#E10600]" />
          <h3 className="subhead-text text-white font-space">Cognizant Career Trajectory</h3>
        </div>
        <p className="mt-2 text-slate-400 text-sm font-inter">
          Enterprise Systems &amp; Data Operations · Full progression from Intern to Application Ops Engineer.
        </p>

        <div className="mt-12 flex">
          <VerticalTimeline animate={true} lineColor="rgba(225, 6, 0, 0.35)">
            {experiences.map((experience, idx) => (
              <VerticalTimelineElement
                key={experience.company_name + experience.title}
                date={experience.date}
                position={idx % 2 === 0 ? "left" : "right"}
                intersectionObserverProps={{
                  rootMargin: "0px 0px -60px 0px",
                  triggerOnce: false,
                }}
                dateClassName="text-[#C0C0C0] font-semibold text-sm font-mono"
                iconStyle={{
                  background: "#ffffff",
                  boxShadow: "0 0 15px rgba(225, 6, 0, 0.4)",
                  border: "2px solid #E10600",
                }}
                icon={
                  <div className="flex justify-center items-center w-full h-full p-2.5">
                    <img
                      src={experience.icon}
                      alt={experience.company_name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                }
                contentStyle={{
                  background: "rgba(36, 36, 36, 0.46)",
                  color: "#C0C0C0",
                  border: "1px solid rgba(192, 192, 192, 0.2)",
                  borderBottom: `6px solid #E10600`,
                  borderRadius: "16px",
                  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.35)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                }}
                contentArrowStyle={{
                  borderRight: "7px solid rgba(36, 36, 36, 0.46)",
                }}
              >
                <div>
                  <h3 className="text-white text-xl font-space font-semibold">
                    {experience.title}
                  </h3>
                  <p
                    className="text-[#E10600] font-medium text-sm mt-1 font-mono"
                    style={{ margin: 0 }}
                  >
                    {experience.company_name}
                  </p>
                </div>

                <ul className="my-5 list-disc ml-5 space-y-2.5 font-inter">
                  {experience.points.map((point, index) => (
                    <li
                      key={`experience-point-${index}`}
                      className="text-[#C0C0C0] font-normal pl-1 text-sm leading-relaxed"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </VerticalTimelineElement>
            ))}
          </VerticalTimeline>
        </div>
      </div>

      {!hideCTA && (
        <>
          <hr className="border-[#333333] my-8" />
          <CTA />
        </>
      )}
    </section>
  );
};

export default About;
