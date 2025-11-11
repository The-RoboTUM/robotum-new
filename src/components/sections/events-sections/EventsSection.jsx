import { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Button from "@components/ui/Button";
import ImageFrame from "@components/ui/ImageFrame";
import { events, EVENT_CATEGORIES } from "@data";

// Map EVENT_CATEGORIES (plural) to event.type (singular) for correct filtering
const normalizeCategory = (label) => {
  if (!label || label === "All") return "All";
  const map = {
    Hackathons: "Hackathon",
    "Info Events": "Info Event",
    Conferences: "Conference",
    Workshops: "Workshop",
    Meetups: "Meetup",
  };
  return map[label] || label;
};

export default function EventsSection() {
  const [activeCategory, setActiveCategory] = useState("All"); // from EVENT_CATEGORIES (plural)
  const [timeframe, setTimeframe] = useState("All"); // 'All' | 'Upcoming' | 'Past'
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [hash]);

  // Derived lists
  const { filteredEvents, counts } = useMemo(() => {
    const now = new Date();
    const normalized = normalizeCategory(activeCategory);
    const inCategory = (e) => normalized === "All" || e.type === normalized;
    const isUpcoming = (e) => new Date(e.end) >= now;
    const isPast = (e) => new Date(e.end) < now;

    // base filtered by category
    let base = events.filter(inCategory);

    // timeframe filter
    if (timeframe === "Upcoming") base = base.filter(isUpcoming);
    if (timeframe === "Past") base = base.filter(isPast);

    // sort: upcoming ascending, past descending; if mixed, keep upcoming first
    const upcoming = base
      .filter(isUpcoming)
      .sort((a, b) => new Date(a.start) - new Date(b.start));
    const past = base
      .filter(isPast)
      .sort((a, b) => new Date(b.end) - new Date(a.end));

    // counts for UI badges
    const countsAll = events.reduce((acc, e) => {
      const key = e.type;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return {
      filteredEvents: [...upcoming, ...past],
      counts: countsAll,
    };
  }, [activeCategory, timeframe]);

  // Format event date range
  const formatDateRange = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const sameMonth =
      startDate.getMonth() === endDate.getMonth() &&
      startDate.getFullYear() === endDate.getFullYear();

    const startStr = startDate.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const endStr = endDate.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    return sameMonth
      ? `${startDate.getDate()}–${endDate.getDate()} ${startDate.toLocaleString(
          "en-US",
          {
            month: "short",
          },
        )}, ${startDate.getFullYear()}`
      : `${startStr} – ${endStr}`;
  };

  return (
    <section
      id="all-events"
      className="section-container font-sans text-white surface-1 edge-fade-top edge-fade-bottom surface-wrap surface-pattern pb-12"
      aria-labelledby="events-section-heading"
      role="region"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6 mb-6">
        <div className="text-left">
          <p className="text-white/60 text-sm md:text-base mb-1">
            Don’t miss what’s next
          </p>
          <h2
            id="events-section-heading"
            className="heading heading-h1 leading-tight"
          >
            Upcoming & Past Events
          </h2>
        </div>
      </div>

      {/* Filters Row */}
      <div className="sm:mx-0 mt-2 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3">
          {/* Category chips (plural labels from EVENT_CATEGORIES) */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {["All", ...EVENT_CATEGORIES].map((cat) => {
              const active = activeCategory === cat;
              const countLabel = (() => {
                const singular = normalizeCategory(cat);
                if (singular === "All") return undefined;
                const count = counts[singular] || 0;
                return count;
              })();
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`cursor-pointer px-5 py-2 text-sm md:text-base font-medium rounded-full transition-all duration-300 border ${
                    active
                      ? "bg-accent text-white border-accent shadow-[0_0_15px_rgba(59,130,246,0.4)] scale-[1.03]"
                      : "border-white/20 text-white/80 hover:border-white/40 hover:text-white"
                  }`}
                >
                  {cat}
                  {typeof countLabel === "number" && (
                    <span className="ml-2 inline-flex items-center justify-center rounded-full bg-white/10 px-2 py-0.5 text-[11px]">
                      {countLabel}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Timeframe segmented control */}
          <div className="inline-flex rounded-full border border-white/15 bg-white/5 p-0.5">
            {["All", "Upcoming", "Past"].map((tf) => {
              const active = timeframe === tf;
              return (
                <button
                  key={tf}
                  type="button"
                  onClick={() => setTimeframe(tf)}
                  className={`cursor-pointer px-3.5 py-1.5 text-sm rounded-full transition-all ${
                    active
                      ? "bg-accent text-white shadow"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  {tf}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content: Visual + Grid */}
      <div className="grid grid-cols-1 gap-8 items-start mt-4">
        <div className="order-1 w-full">
          {filteredEvents.length === 0 ? (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-56 rounded-2xl bg-white/5 border border-white/10 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div
              className="mt-2 grid gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
              role="list"
            >
              {filteredEvents.map((event) => {
                const isPast = new Date(event.end) < new Date();
                return (
                  <article
                    key={event.id}
                    role="listitem"
                    className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-accent/80 hover:shadow-[0_8px_24px_rgba(59,130,246,0.18)] focus-within:shadow-[0_8px_24px_rgba(59,130,246,0.2)]"
                  >
                    {/* Media */}
                    <div className="relative">
                      <ImageFrame
                        src={event.cover}
                        alt={event.title}
                        aspect="4/3"
                        fit="cover"
                        variant="soft"
                        rounded="none"
                      />
                      {/* Type badge */}
                      <div className="absolute left-3 top-3 inline-flex items-center rounded-full border border-white/20 bg-black/30 backdrop-blur px-2.5 py-1 text-[11px] uppercase tracking-wide text-white/90">
                        {event.type}
                      </div>
                      {/* Past badge */}
                      {isPast && (
                        <div className="absolute right-3 top-3 inline-flex items-center rounded-full border border-white/20 bg-white/10 backdrop-blur px-2.5 py-1 text-[11px] uppercase tracking-wide text-white/80">
                          Past
                        </div>
                      )}
                    </div>

                    {/* Body */}
                    <div className="p-4 sm:p-5 flex flex-col grow text-left">
                      <h3 className="text-lg md:text-xl font-semibold mb-1 leading-snug text-white">
                        {event.title}
                      </h3>
                      <p className="text-sm text-white/70 mb-0.5">
                        {formatDateRange(event.start, event.end)}
                      </p>
                      <p className="text-sm text-white/50 italic mb-3">
                        {event.location}
                      </p>
                      <p className="text-text2 text-white/80 leading-relaxed mb-5 grow">
                        {event.blurb}
                      </p>

                      <div className="mt-auto flex items-center justify-between">
                        <Button
                          variant="secondary"
                          as="link"
                          to={event.links?.register || "/events"}
                          className="text-sm px-4 py-1.5"
                        >
                          {isPast ? "Details →" : "Register →"}
                        </Button>
                        <svg
                          className="h-5 w-5 text-white/60 group-hover:text-white transition-colors"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden
                        >
                          <path
                            d="M7 5l6 5-6 5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
