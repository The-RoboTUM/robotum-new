import React, { useMemo, useState } from 'react'
import * as assets from '@assets'
import Button from '@components/ui/Button'
import ImageFrame from '@components/ui/ImageFrame'
import { events, EVENT_CATEGORIES } from '@data'

export default function EventsSection() {
  const [activeCategory, setActiveCategory] = useState('All')

  // Derive filtered + ordered events (upcoming first by start date, then most recent past)
  const filteredEvents = useMemo(() => {
    const now = new Date()
    const inCategory = (e) => activeCategory === 'All' || e.type === activeCategory

    const upcoming = events
      .filter((e) => new Date(e.end) >= now && inCategory(e))
      .sort((a, b) => new Date(a.start) - new Date(b.start))

    const past = events
      .filter((e) => new Date(e.end) < now && inCategory(e))
      .sort((a, b) => new Date(b.end) - new Date(a.end))

    return [...upcoming, ...past]
  }, [activeCategory])

  // Format event date range
  const formatDateRange = (start, end) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const sameMonth =
      startDate.getMonth() === endDate.getMonth() &&
      startDate.getFullYear() === endDate.getFullYear()

    const startStr = startDate.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
    const endStr = endDate.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })

    return sameMonth
      ? `${startDate.getDate()}–${endDate.getDate()} ${startDate.toLocaleString('en-US', {
          month: 'short',
        })}, ${startDate.getFullYear()}`
      : `${startStr} – ${endStr}`
  }

  return (
    <section
      id="upcoming-events"
      className="section-container font-sans text-white surface-1 edge-fade-top edge-fade-bottom surface-wrap surface-pattern"
      aria-labelledby="events-section-heading"
      role="region"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6 mb-8">
        <div className="text-left">
          <p className="text-white/60 text-sm md:text-base mb-1">Don’t miss what’s next</p>
          <h2
            id="events-section-heading"
            className="heading heading-h1 leading-tight"
          >
            Upcoming & Past Events
          </h2>
        </div>
        <div className="hidden md:block">
          <Button as="link" to="/events" variant="secondary">
            View all events →
          </Button>
        </div>
      </div>

      {/* Category Filter (sticky on mobile for easier browsing) */}
      <div className="sticky top-16 z-10 -mx-6 sm:mx-0 bg-transparent/0 backdrop-blur-[1px] pb-4">
        <div className="flex justify-start md:justify-center flex-wrap gap-2 sm:gap-3">
          {['All', ...EVENT_CATEGORIES].map((cat) => {
            const active = activeCategory === cat
            return (
              <Button
                key={cat}
                variant="secondary"
                onClick={() => setActiveCategory(cat)}
                className={`text-sm md:text-base px-4 py-1.5 rounded-full transition-all duration-300 ${
                  active
                    ? 'bg-accent text-white shadow-[0_0_20px_rgba(59,130,246,0.35)] scale-[1.03]'
                    : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                }`}
              >
                {cat}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-2xl bg-white/5 border border-white/10 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {filteredEvents.map((event) => {
            const isPast = new Date(event.end) < new Date()
            return (
              <article
                key={event.id}
                role="listitem"
                className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-accent/80 hover:shadow-[0_12px_40px_rgba(59,130,246,0.22)] focus-within:shadow-[0_12px_40px_rgba(59,130,246,0.22)]"
              >
                {/* Media */}
                <div className="relative">
                  <ImageFrame
                    src={event.cover}
                    alt={event.title}
                    aspect="3/2"
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
                <div className="p-6 flex flex-col grow text-left">
                  <h3 className="text-text1 md:text-h2 font-semibold mb-1 leading-tight text-white">
                    {event.title}
                  </h3>
                  <p className="text-sm text-white/70 mb-0.5">
                    {formatDateRange(event.start, event.end)}
                  </p>
                  <p className="text-sm text-white/50 italic mb-3">{event.location}</p>
                  <p className="text-text2 text-white/80 leading-relaxed mb-6 grow">
                    {event.blurb}
                  </p>

                  <div className="mt-auto flex items-center justify-between">
                    <Button
                      variant="secondary"
                      as="link"
                      to={event.links?.register || '/events'}
                      className="text-sm px-5 py-2"
                    >
                      {isPast ? 'Details →' : 'Register →'}
                    </Button>
                    <svg
                      className="h-5 w-5 text-white/60 group-hover:text-white transition-colors"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden
                    >
                      <path d="M7 5l6 5-6 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* Mobile CTA */}
      <div className="mt-10 md:hidden">
        <Button as="link" to="/events" variant="secondary" className="w-full justify-center">
          View all events →
        </Button>
      </div>
    </section>
  )
}