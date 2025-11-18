import React from "react";
import Button from "@components/ui/Button";

const STORIES = [
  {
    name: "Marco Färber-Gonzalez",
    role: "Head of External Relations",
    track: "Operations",
    joined: "Joined in 2023",
    highlight: "Turned outreach ideas into real industry partnerships.",
    quote:
      "RoboTUM gave me the freedom to experiment with crazy ideas — and a team that actually wants to build them.",
  },
  {
    name: "Maryna Redka",
    role: "Technical Project Lead",
    track: "Technical",
    joined: "Joined in 2022",
    highlight: "Led a cross-faculty team on our humanoid project.",
    quote:
      "It’s the only place at TUM where I can go from FEA simulation to soldering to a demo night in one week.",
  },
  {
    name: "Ediz Perez Landeros",
    role: "Innovation & Entrepreneurship",
    track: "Innovation & Entrepreneurship",
    joined: "Joined in 2024",
    highlight:
      "Co-created new formats like RoboTUM Podcast & Robo Spark Summit.",
    quote:
      "RoboTUM felt like a startup inside the university — we prototype fast, learn faster, and actually ship things.",
  },
  {
    name: "You?",
    role: "Future Member",
    track: "Any discipline",
    joined: "Join us next semester",
    highlight: "Your story could be the next one here.",
    quote:
      "You don’t need to be a robotics expert to start — curiosity and initiative are more important than your current CV.",
  },
];

export default function MemberStoriesSection() {
  return (
    <section id="member-stories" className="section-dark-primary surface-pattern">
      <div className="section-container max-w-6xl">
        {/* Heading block */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs tracking-widest text-white/60 uppercase mb-2">
              Member Stories
            </p>
            <h2 className="mt-4 text-balance text-[clamp(1.8rem,3vw+0.4rem,2.4rem)] font-semibold leading-tight text-white">
              What it&apos;s like to build{" "}
              <span className="text-gradient">robots with us</span>
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">
              Real experiences from people behind our projects — from technical
              builds to community events and partnerships.
            </p>
          </div>

          <div className="mt-2 md:mt-0">
            <Button
              as="link"
              to="/about"
              scrollTarget="team-section"
              variant="secondary"
              className="text-sm"
            >
              Meet the team →
            </Button>
          </div>
        </div>

        {/* Stories grid */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {STORIES.map((story) => (
            <article
              key={story.name}
              className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/5 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.55)] backdrop-blur-md transition-all duration-300 hover:border-accent/60 hover:bg-white/8 hover:shadow-[0_22px_60px_rgba(15,23,42,0.75)]"
            >
              {/* Decorative gradient stripe */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-linear-to-r from-[#60A5FA] via-[#A78BFA] to-[#22D3EE] opacity-60 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="flex items-start gap-4">
                {/* Initials avatar */}
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(15,23,42,0.7)]">
                  {story.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold leading-snug text-white">
                      {story.name}
                    </h3>
                    <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-[0.12em] text-white/70">
                      {story.track}
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-medium text-white/60">
                    {story.role}
                  </p>
                  <p className="mt-0.5 text-[11px] text-white/40">
                    {story.joined}
                  </p>
                </div>
              </div>

              {/* Quote */}
              <p className="mt-4 text-sm leading-relaxed text-white/80">
                <span className="mr-1 text-base text-gradient">“</span>
                {story.quote}
                <span className="ml-1 text-base text-gradient">”</span>
              </p>

              {/* Highlight line */}
              <div className="mt-4 flex items-center justify-between gap-3 text-[11px] text-white/60">
                <p className="flex-1 leading-snug">
                  <span className="font-semibold text-white/80">
                    Impact:&nbsp;
                  </span>
                  {story.highlight}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
