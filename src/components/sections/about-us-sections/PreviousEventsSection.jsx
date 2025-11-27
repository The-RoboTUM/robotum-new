// src/components/sections/events-sections/PreviousEventsSection.jsx

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Button from "@components/ui/Button";
import ImageFrame from "@components/ui/ImageFrame";
import { fetchEvents } from "@data"; // from eventsApi.js (exported via @data/index.js)
import { formatEventDateRange } from "@utils/date-range";

export default function PreviousEventsSection() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Load all events from Supabase (we'll filter to past ones)
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMsg("");

      try {
        const data = await fetchEvents();
        setEvents(data);
      } catch (err) {
        console.error("Error loading previous events:", err);
        setErrorMsg("Failed to load previous events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // Only past events, sorted by end_at (desc)
  const pastEvents = useMemo(() => {
    if (!events || events.length === 0) return [];

    const now = new Date();

    return events
      .filter((e) => {
        const end = e.end_at ? new Date(e.end_at) : new Date(e.start_at);
        return end < now;
      })
      .sort((a, b) => {
        const endA = a.end_at ? new Date(a.end_at) : new Date(a.start_at);
        const endB = b.end_at ? new Date(b.end_at) : new Date(b.start_at);
        return endB - endA; // newest past first
      });
  }, [events]);

  // Reusable card for previous events
  const PreviousEventCard = ({ event }) => {
    const locationElement = event.location_url ? (
      <a
        href={event.location_url}
        target="_blank"
        rel="noreferrer"
        className="underline decoration-accent/60 decoration-dotted hover:text-accent"
      >
        {event.location_name}
      </a>
    ) : (
      event.location_name
    );

    return (
      <article className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-accent/80 hover:shadow-[0_8px_24px_rgba(59,130,246,0.18)]">
        {/* Media */}
        {event.cover_url && (
          <div className="relative">
            <ImageFrame
              src={event.cover_url}
              alt={event.title}
              aspect="4/3"
              fit="cover"
              variant="soft"
              rounded="none"
            />
            <div className="absolute left-3 top-3 inline-flex items-center rounded-full border border-white/20 bg-black/30 backdrop-blur px-2.5 py-1 text-[11px] uppercase tracking-wide text-white/90">
              Past Event
            </div>
          </div>
        )}

        {/* Body */}
        <div className="p-4 sm:p-5 flex flex-col grow text-left">
          <h3 className="text-lg md:text-xl font-semibold mb-1 leading-snug text-white">
            {event.title}
          </h3>
          <p className="text-sm text-white/70 mb-0.5">
            {formatEventDateRange(event.start_at, event.end_at)}
          </p>
          <p className="text-sm text-white/50 italic mb-3">
            {locationElement}
          </p>
          <p className="text-text2 text-white/80 leading-relaxed mb-5 grow">
            {event.summary}
          </p>

          <div className="mt-auto flex items-center justify-between">
            <Button
              variant="secondary"
              as={Link}
              to={`/events/${event.slug}`}
              className="text-sm px-4 py-1.5"
            >
              View details →
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
  };

  return (
    <section
      id="previous-events"
      className="section-container font-sans text-white pb-12 section-dark-secondary surface-pattern"
      aria-labelledby="previous-events-heading"
      role="region"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6 mb-6">
        <div className="text-left">
          <p className="text-xs tracking-widest text-white/60 uppercase mb-2">
            Highlights from the past
          </p>
          <h2
            id="previous-events-heading"
            className="heading heading-h2 leading-tight"
          >
            Previous Events
          </h2>
        </div>
      </div>

      {/* Error */}
      {errorMsg && (
        <div className="mb-4 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-100">
          {errorMsg}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-56 rounded-2xl bg-white/5 border border-white/10 animate-pulse"
            />
          ))}
        </div>
      ) : pastEvents.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
          No previous events recorded yet.
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pastEvents.map((event) => (
            <PreviousEventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </section>
  );
}