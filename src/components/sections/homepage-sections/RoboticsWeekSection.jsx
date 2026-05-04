import { Link } from "react-router-dom";
import * as assets from "@assets";
import Button from "@components/ui/Button";

export default function RoboticsWeekSection() {
  return (
    <section className="section-container py-6 md:py-8 font-sans text-white">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgba(6,182,212,0.18),rgba(15,23,42,0.92)_55%,rgba(59,130,246,0.2))] backdrop-blur-sm shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
        <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative p-6 sm:p-8 md:p-10 lg:p-12">
            <div className="absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.28),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.22),transparent_36%)]" />
            <div className="relative max-w-2xl space-y-4">
              <p className="text-xs tracking-[0.3em] text-white/65 uppercase">
                22–26 June 2026 · Munich
              </p>
              <h2 className="heading heading-h2 leading-tight text-balance">
                Europe Embodied
              </h2>
              <p className="text-sm md:text-base text-white/78 leading-relaxed max-w-xl">
                The future of physical AI is being written in labs, garages, and studios across Europe. For one week, Munich becomes the lens that focuses it—with four tracks, two days of building, and the ecosystem summit.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button as={Link} to="/roboticsweek" variant="primary">
                  Join Robotics Week
                </Button>
                <Button as={Link} to="/events" variant="secondary">
                  View all events
                </Button>
              </div>
            </div>
          </div>

          <div className="relative min-h-[220px] sm:min-h-[280px] lg:min-h-full">
            <img
              src={assets.eventImg}
              alt="Europe Embodied – Robotics Week"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,7,18,0.08),rgba(3,7,18,0.72))]" />
            <div className="absolute inset-0 flex items-end p-6 sm:p-8">
              <div className="rounded-2xl border border-white/15 bg-black/35 px-4 py-3 backdrop-blur-sm max-w-xs">
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/55 mb-1">
                  Robotics Summit
                </p>
                <p className="text-sm text-white/90 leading-relaxed">
                  Hackathon, workshops, talks, and ecosystem building for European robotics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}