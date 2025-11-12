import { Link } from "react-router-dom";
import Button from "@components/ui/Button";
import ImageFrame from "@components/ui/ImageFrame";

/**
 * WhatIsRobotum — About page intro section
 * - Dark surface, soft gradients, balanced layout
 * - Uses design tokens from globals.css (heading, text-text1/2, surface-*)
 * - Optional illustration via props; if none provided, shows a decorative card
 */
export default function WhatIsRobotum({ illustration }) {
  return (
    <section
      id="what-is-robotum"
      className="section-container surface-2 edge-fade-top edge-fade-bottom font-sans"
      aria-labelledby="what-robotum-heading"
      role="region"
    >
      <div className="grid gap-12 lg:gap-16 md:grid-cols-2 items-center">
        {/* Copy column */}
        <div className="animate-fadeIn">
          <p className="mb-3 text-sm tracking-[0.15em] uppercase text-white/70">
            Student initiative @ TUM
          </p>
          <h2
            id="what-robotum-heading"
            className="heading heading-h1 mb-5 text-white leading-tight text-balance"
          >
            What is <span className="text-accent">RoboTUM</span>?
          </h2>
          <p className="text-text1 text-white/85 leading-relaxed mb-6">
            RoboTUM is a student-led robotics community at TUM. Our vision is to
            help establish
            <span className="font-semibold text-accent"> Munich</span> as a
            global robotics hub — comparable to Boston or Switzerland. Our
            mission is to{" "}
            <span className="font-semibold text-[#7C3AED]">
              bridge industry and academia
            </span>
            , turning research into real-world innovation and entrepreneurship.
          </p>

          {/* Pillars / categories */}
          <ul className="grid gap-3 mb-8">
            <li className="flex items-start gap-3">
              <span className="mt-1.5 inline-block h-2 w-2 rounded-full bg-[#60A5FA]" />
              <div>
                <p className="text-text1 font-semibold">Technical Projects</p>
                <p className="text-text2 text-white/75">
                  Hands-on robotics: humanoids, creative robotics, web &
                  infrastructure.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 inline-block h-2 w-2 rounded-full bg-[#7C3AED]" />
              <div>
                <p className="text-text1 font-semibold">Operations</p>
                <p className="text-text2 text-white/75">
                  HR, finance & legal, community engagement, and weekly
                  workshops.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 inline-block h-2 w-2 rounded-full bg-[#22D3EE]" />
              <div>
                <p className="text-text1 font-semibold">
                  Innovation & Entrepreneurship
                </p>
                <p className="text-text2 text-white/75">
                  Precelerator, RoboWeek events, ROBO SPARK SUMMIT, and our
                  podcast.
                </p>
              </div>
            </li>
          </ul>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <Button as={Link} to="/projects" variant="primary">
              Explore projects
            </Button>
            <Button as={Link} to="/join" variant="secondary">
              Join us
            </Button>
          </div>
        </div>

        {/* Visual column */}
        <div className="animate-fadeIn" style={{ animationDelay: "120ms" }}>
          {illustration ? (
            <ImageFrame
              src={illustration}
              alt="RoboTUM community — projects and people"
              aspect="3/2"
              fit="cover"
              variant="border"
              vignette
              rounded="2xl"
              className="w-full"
            />
          ) : (
            <div className="relative w-full rounded-2xl overflow-hidden bg-white/5 border border-white/10 p-6">
              {/* Decorative gradient ring */}
              <div className="absolute -inset-1 rounded-[20px] opacity-40 blur-xl bg-[conic-gradient(from_120deg,#2563EB,transparent_40%,#7C3AED_70%,transparent_85%)]" />

              <div className="relative grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl p-4 bg-white/5 border border-white/10">
                    <p className="text-sm text-white/70 mb-1">Since</p>
                    <p className="text-text1 font-semibold">2024</p>
                  </div>
                  <div className="rounded-xl p-4 bg-white/5 border border-white/10">
                    <p className="text-sm text-white/70 mb-1">Members</p>
                    <p className="text-text1 font-semibold">100+ students</p>
                  </div>
                </div>
                <div className="rounded-xl p-5 bg-white/5 border border-white/10">
                  <p className="text-sm text-white/70 mb-2">Focus</p>
                  <p className="text-text2 text-white/85">
                    Robotics R&D • Community • Entrepreneurship
                  </p>
                </div>
                <div className="rounded-xl p-5 bg-white/5 border border-white/10">
                  <p className="text-sm text-white/70 mb-2">Collaborations</p>
                  <p className="text-text2 text-white/85">
                    TUM chairs, industry partners & venture labs
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Keywords marquee (subtle) */}
      <div className="mt-12 overflow-hidden">
        <div className="flex items-center gap-4 animate-marquee whitespace-nowrap opacity-80">
          {[
            "Humanoids",
            "ROS",
            "Perception",
            "Control",
            "HRI",
            "Startups",
            "Workshops",
            "Community",
            "Open-source",
            "Competitions",
          ].map((k) => (
            <span
              key={k}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs bg-white/8 border border-white/10 mx-2"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" /> {k}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
