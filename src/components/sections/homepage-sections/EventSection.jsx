import { useState, useMemo } from "react";
import * as assets from "@assets";
import Button from "@components/ui/Button";
import ImageFrame from "@components/ui/ImageFrame";
import { events } from "@data";
import { formatEventDateRange } from "@utils/date-range";

export default function EventSection() {
  const [activeIndex, setActiveIndex] = useState(-1);

  // Compute the 3 nearest events: upcoming first by start date; if fewer than 3, backfill with most recent past
  const nearestEvents = useMemo(() => {
    const now = new Date();
    const upcoming = events
      .filter((e) => new Date(e.end) >= now)
      .sort((a, b) => new Date(a.start) - new Date(b.start));

    const past = events
      .filter((e) => new Date(e.end) < now)
      .sort((a, b) => new Date(b.end) - new Date(a.end));

    const combined = [...upcoming, ...past];
    return combined.slice(0, 3);
  }, []);

  const safeActiveIndex = activeIndex >= 0 ? activeIndex : null;

  return (
    <section
      id="events"
      className="section-container font-sans text-white section-dark-primary surface-pattern"
      aria-labelledby="events-section-heading"
      role="region"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        <div className="text-left">
          <p className="text-xs tracking-widest text-white/60 uppercase mb-2">
            Don’t miss what’s next
          </p>
          <h2
            id="events-section-heading"
            className="heading heading-h2 font-bold leading-tight"
          >
            Where<span className="text-gradient"> Minds Meet</span>
          </h2>
        </div>
        <div className="hidden md:block">
          <Button as="link" to="/events" variant="secondary">
            View All Events →
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Visual */}
        <div className="lg:col-span-5">
          <ImageFrame
            src={assets.automatica}
            alt="Event speaker"
            aspect="3/2"
            fit="cover"
            variant="soft"
            rounded="2xl"
            className="w-full shadow-lg"
          />
          <div className="mt-6 md:hidden">
            <Button
              as="link"
              to="/events"
              variant="secondary"
              className="w-full justify-center"
            >
              View all events →
            </Button>
          </div>
        </div>

        {/* List */}
        <div
          className="lg:col-span-7 flex flex-col"
          role="list"
          aria-labelledby="events-section-heading"
        >
          {nearestEvents.length === 0 && (
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-white/70">
              No events to show yet. Check back soon!
            </div>
          )}

          <ol className="space-y-4">
            {nearestEvents.map((event, index) => {
              const isActive = safeActiveIndex === index;
              const isPast = new Date(event.end) < new Date();
              return (
                <li key={event.id} role="listitem">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveIndex(activeIndex === index ? -1 : index)
                    }
                    aria-expanded={isActive ? "true" : "false"}
                    aria-controls={`event-panel-${index}`}
                    className={`group w-full text-left cursor-pointer p-5 md:p-6 rounded-2xl border transition-all duration-400 backdrop-blur-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 ${
                      isActive
                        ? "bg-accent/15 border-accent shadow-[0_8px_28px_rgba(59,130,246,0.25)]"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Date chip */}
                      <div className="flex gap-4 items-start">
                        <div className="text-center px-3 py-2 rounded-lg bg-white/5 border border-white/10 min-w-[60px]">
                          <div className="text-[11px] font-semibold text-slate-300 tracking-wider uppercase">
                            {new Date(event.start).toLocaleString("en-US", {
                              month: "short",
                            })}
                          </div>
                          <div className="text-2xl font-bold text-white leading-none">
                            {new Date(event.start).getDate()}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[11px] uppercase tracking-wide text-white/80">
                              {event.type}
                            </span>
                            {isPast && (
                              <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[11px] uppercase tracking-wide text-white/60">
                                Past
                              </span>
                            )}
                          </div>
                          <div className="text-[15px] md:text-base font-semibold text-white">
                            {event.title}
                          </div>
                          <div className="text-sm text-white/60 italic">
                            {formatEventDateRange(event.start, event.end)} ·{" "}
                            {event.location}
                          </div>
                        </div>
                      </div>

                      {/* Caret icon */}
                      <svg
                        className={`h-5 w-5 text-white/80 transition-transform duration-300 mt-1 ${isActive ? "rotate-180" : ""}`}
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          d="M6 8l4 4 4-4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    {/* Reveal panel */}
                    <div
                      id={`event-panel-${index}`}
                      className={`grid transition-[grid-template-rows,opacity] duration-400 ease-out ${
                        isActive
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="mt-4 text-slate-200">
                          <p className="leading-relaxed">{event.blurb}</p>
                          {event.links?.register && (
                            <div className="mt-4">
                              <Button
                                variant="secondary"
                                as="link"
                                to={event.links.register}
                                className="text-sm px-4 py-2"
                              >
                                Register →
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
